'use server';

import {
  evaluateProspect,
  type EvaluateProspectInput,
  type EvaluateProspectOutput,
} from '@/ai/flows/automated-prospect-evaluation';
import {
  generatePersonalizedMessage,
  type GeneratePersonalizedMessageInput,
  type GeneratePersonalizedMessageOutput,
} from '@/ai/flows/generate-personalized-messages';
import { getFirestore } from 'firebase-admin/firestore';
import {getFirebaseAdminApp} from '@/firebase/admin';

export async function evaluateProspectAction(
  input: EvaluateProspectInput
): Promise<EvaluateProspectOutput> {
  return evaluateProspect(input);
}

export async function generateMessageAction(
  input: GeneratePersonalizedMessageInput
): Promise<GeneratePersonalizedMessageOutput> {
  return generatePersonalizedMessage(input);
}

export async function addProspectAction(prospectData: any, userId: string) {
    const adminApp = getFirebaseAdminApp();
    const firestore = getFirestore(adminApp);
    const prospectRef = firestore.collection('users').doc(userId).collection('prospects').doc();
    
    await prospectRef.set({
        ...prospectData,
        id: prospectRef.id,
        userId: userId,
        status: 'new',
        lastContacted: null,
    });

    return { id: prospectRef.id };
}

export async function updateProspectStatusAction(prospectId: string, status: string, userId: string) {
    const adminApp = getFirebaseAdminApp();
    const firestore = getFirestore(adminApp);
    const prospectRef = firestore.collection('users').doc(userId).collection('prospects').doc(prospectId);

    await prospectRef.update({
        status: status,
        lastContacted: new Date().toISOString(),
    });
}
