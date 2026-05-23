/**
 * Sanity check for type-based answer validation.
 * Run: npx tsx src/scripts/validate-answer-rules.ts
 */
import { questionSchema } from '../api/validators/schemas/question.schema';
import { normalizeGeneratedPaperPayload } from '../services/ai/question-normalizer';

const cases = [
  {
    label: 'mcq with options',
    data: {
      text: 'Which tool scans resumes for keywords?',
      difficulty: 'easy' as const,
      marks: 2,
      type: 'mcq' as const,
      options: ['Recruiter', 'Designer', 'ATS Scanner', 'Manager'],
      correctAnswer: 'ATS Scanner',
    },
    expectValid: true,
  },
  {
    label: 'mcq legacy answer only',
    raw: {
      text: 'Which tool scans resumes for keywords?',
      difficulty: 'easy',
      marks: 2,
      type: 'mcq',
      answer: 'B) ATS Scanner',
    },
    expectValid: false,
  },
  {
    label: 'fill_blank short',
    data: {
      text: 'The _____ carries blood to the heart',
      difficulty: 'easy' as const,
      marks: 1,
      type: 'fill_blank' as const,
      answer: 'ATS',
    },
    expectValid: true,
  },
  {
    label: 'marks decimal normalized',
    raw: {
      text: 'Explain photosynthesis in leaves',
      difficulty: 'medium',
      marks: 2.5,
      type: 'short',
      answer:
        'Photosynthesis converts light energy into chemical energy in chloroplasts, producing glucose and oxygen from carbon dioxide and water.',
    },
    expectValid: true,
  },
  {
    label: 'prompt prefix stripped',
    raw: {
      text: 'Prompt 1: Resume Analysis provide to the user?',
      difficulty: 'easy',
      marks: 1,
      type: 'fill_blank',
      answer: 'keywords',
    },
    expectValid: false,
  },
  {
    label: 'bad prompt question text',
    data: {
      text: 'Prompt 2: ATS Scanner provide to the user?',
      difficulty: 'easy' as const,
      marks: 1,
      type: 'short' as const,
      answer: 'Too short',
    },
    expectValid: false,
  },
  {
    label: 'mcq with blank placeholder',
    data: {
      text: 'The _____ is the powerhouse of the cell',
      difficulty: 'easy' as const,
      marks: 1,
      type: 'mcq' as const,
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'],
      correctAnswer: 'Mitochondria',
    },
    expectValid: false,
  },
  {
    label: 'fill_blank missing blank',
    data: {
      text: 'Which organelle produces ATP in cells?',
      difficulty: 'easy' as const,
      marks: 1,
      type: 'fill_blank' as const,
      answer: 'mitochondria',
    },
    expectValid: false,
  },
  {
    label: 'true_false essay prompt',
    data: {
      text: 'Explain how vaccines stimulate antibody production.',
      difficulty: 'medium' as const,
      marks: 2,
      type: 'true_false' as const,
      answer: 'True — vaccines introduce antigens that trigger adaptive immunity.',
    },
    expectValid: false,
  },
  {
    label: 'short explain accepted',
    data: {
      text: 'Explain the role of chlorophyll in photosynthesis.',
      difficulty: 'medium' as const,
      marks: 4,
      type: 'short' as const,
      answer:
        'Chlorophyll absorbs light in chloroplasts and drives conversion of CO2 and water into glucose while releasing oxygen.',
    },
    expectValid: true,
  },
  {
    label: 'short define accepted',
    data: {
      text: 'Define osmosis and state one biological example.',
      difficulty: 'easy' as const,
      marks: 3,
      type: 'short' as const,
      answer:
        'Osmosis is the net movement of water across a semipermeable membrane from lower to higher solute concentration, e.g. water uptake by root hair cells.',
    },
    expectValid: true,
  },
  {
    label: 'long derive accepted',
    data: {
      text: 'Derive the expression for kinetic energy in terms of mass and velocity.',
      difficulty: 'hard' as const,
      marks: 6,
      type: 'long' as const,
      answer:
        'Starting from work-energy, integrating F=ma over displacement shows KE = 1/2 mv^2 for a particle accelerated from rest through distance s under constant force.',
    },
    expectValid: true,
  },
  {
    label: 'true_false declarative accepted',
    data: {
      text: 'Mitochondria are the primary site of aerobic respiration in eukaryotic cells.',
      difficulty: 'easy' as const,
      marks: 1,
      type: 'true_false' as const,
      answer: 'True — mitochondria carry out the Krebs cycle and oxidative phosphorylation.',
    },
    expectValid: true,
  },
];

let failed = 0;

for (const item of cases) {
  const input =
    'raw' in item
      ? normalizeGeneratedPaperPayload({ questions: [item.raw] })
      : item.data;

  const question =
    input &&
    typeof input === 'object' &&
    'questions' in input &&
    Array.isArray((input as { questions: unknown[] }).questions)
      ? (input as { questions: unknown[] }).questions[0]
      : input;

  const result = questionSchema.safeParse(question);
  const valid = result.success;
  const ok = valid === item.expectValid;

  if (!ok) {
    failed += 1;
    console.error(
      `FAIL: ${item.label} — expected ${item.expectValid ? 'valid' : 'invalid'}, got ${valid ? 'valid' : 'invalid'}`,
    );
    if (!result.success) {
      console.error('  ', result.error.flatten().fieldErrors);
    }
  } else {
    console.log(`OK: ${item.label}`);
  }
}

if (failed > 0) {
  process.exit(1);
}

console.log(`\nAll ${cases.length} cases passed.`);
