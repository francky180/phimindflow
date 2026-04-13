import { redirect } from 'next/navigation';
import { brokerLink } from '../constants';

export default function RegisterPage() {
  redirect(brokerLink);
}
