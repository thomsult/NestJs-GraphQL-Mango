import * as crypto from 'crypto';

export default function gravatar({
  email,
  size = 200,
  rating = 'pg',
  defaultImage = 'retro',
}) {
  if (!email) {
    return;
  }
  const hash = crypto.createHash('md5').update(email).digest('hex');
  const url = `https://gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}&r=${rating}`;

  return url;
}
