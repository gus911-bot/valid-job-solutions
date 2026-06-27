import { NextResponse } from 'next/server';
import { reservationSchema } from '@/lib/validations/reservation';
import { createAdminClient } from '@/lib/supabase/admin';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import {
  CV_ACCEPTED,
  CV_MAX_BYTES,
  CV_MAX_LABEL,
  detectCvMime,
  slugifyFilename,
} from '@/lib/cv';
import { randomUUID } from 'crypto';

const CV_BUCKET = 'cvs';

// Réservation via multipart/form-data (un fichier CV optionnel + champs texte).
// L'upload Storage et l'INSERT passent par le client service_role (serveur uniquement).
export async function POST(request: Request) {
  // 1. Rate limiting par IP.
  const ip = getClientIp(request.headers);
  const { success } = await rateLimit(`reservation:${ip}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!success) {
    return NextResponse.json(
      { error: 'Trop de demandes. Veuillez réessayer dans une minute.' },
      { status: 429 },
    );
  }

  // 2. Parse multipart.
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === 'string' ? v : undefined;
  };

  // 3. Revalidation Zod des champs texte.
  const parsed = reservationSchema.safeParse({
    full_name: str('full_name'),
    email: str('email'),
    phone: str('phone'),
    service: str('service'),
    target_country: str('target_country') ?? '',
    current_situation: str('current_situation') ?? '',
    message: str('message') ?? '',
    preferred_date: str('preferred_date') ?? '',
    preferred_slot: str('preferred_slot') ?? '',
    website: str('website') ?? '',
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides.', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // 4. Honeypot → bot : réponse OK sans rien faire.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createAdminClient();

  // 5. Traitement du CV (optionnel).
  let cv: {
    cv_path: string;
    cv_filename: string;
    cv_size_bytes: number;
    cv_mime: string;
  } | null = null;

  const fileEntry = form.get('cv');
  if (fileEntry instanceof File && fileEntry.size > 0) {
    if (fileEntry.size > CV_MAX_BYTES) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (max ${CV_MAX_LABEL}).` },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await fileEntry.arrayBuffer());

    // Détection par magic bytes — on ne fait PAS confiance à l'extension/MIME annoncé.
    const realMime = detectCvMime(buffer.subarray(0, 8));
    if (!realMime) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé (PDF, DOC ou DOCX uniquement).' },
        { status: 400 },
      );
    }

    const ext = CV_ACCEPTED[realMime].ext;
    const slug = slugifyFilename(fileEntry.name.replace(/\.[^.]+$/, '')) || 'cv';
    const path = `uploads/${randomUUID()}-${slug}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(CV_BUCKET)
      .upload(path, buffer, { contentType: realMime, upsert: false });

    if (upErr) {
      console.error('Upload CV échoué:', upErr.message);
      return NextResponse.json(
        { error: 'Échec de l\'envoi du fichier. Réessayez.' },
        { status: 500 },
      );
    }

    cv = {
      cv_path: path,
      cv_filename: fileEntry.name.slice(0, 200),
      cv_size_bytes: fileEntry.size,
      cv_mime: realMime,
    };
  }

  // 6. INSERT. Si échec après upload → on supprime le fichier (pas d'orphelin).
  const { error } = await supabase.from('reservations').insert({
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    service: data.service,
    target_country: data.target_country || null,
    current_situation: data.current_situation || null,
    message: data.message || null,
    preferred_date: data.preferred_date || null,
    preferred_slot: data.preferred_slot || null,
    ...(cv ?? {}),
  });

  if (error) {
    console.error('Insert réservation échoué:', error.message);
    if (cv) {
      await supabase.storage.from(CV_BUCKET).remove([cv.cv_path]);
    }
    return NextResponse.json(
      { error: 'Enregistrement impossible pour le moment.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
