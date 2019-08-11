import { nouns, adjectives } from './words';
import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';
import jwt from 'jsonwebtoken';

export function generateSecret() {
  const randomIndex = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomIndex]} ${nouns[randomIndex]}`;
}

export function sendMail(email) {
  const options = {
    auth: { api_user: process.env.SENDGRID_USERNAME, api_key: process.env.SENDGRID_PASSWORD }
  };

  const client = nodemailer.createTransport(sgTransport(options));
  return client.sendMail(email);
}

export function sendSecretMail(address, secret) {
  const email = {
    from: 'test@prismagram.com',
    to: address,
    subject: '🔒Login Secret for Prismagram🔒',
    html: `Hello! Your login secret is <b>${secret}</b>.`
  };

  return sendMail(email);
}

export function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET);
}
