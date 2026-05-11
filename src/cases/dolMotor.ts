import type { LadderElement } from '../store/userStore';

export interface Question {
  id: string;
  title: string;
  description: string;
  hint: string;
  expectedAnswer: LadderElement[];
  maxRungs: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  ioAssignment: { type: 'input' | 'output'; address: string; label: string }[];
  questions: Question[];
}

export const dolMotorCase: CaseStudy = {
  id: 'dol_motor',
  title: 'Motor DOL Control',
  description: 'Direct On Line (DOL) motor starter adalah metode paling sederhana untuk mengontrol motor listrik. Pelajari konsep start/stop, latching, dan overload protection.',
  ioAssignment: [
    { type: 'input', address: 'I0.0', label: 'Start Button (NO)' },
    { type: 'input', address: 'I0.1', label: 'Stop Button (NC)' },
    { type: 'input', address: 'I0.2', label: 'Overload Relay' },
    { type: 'output', address: 'Q0.0', label: 'Motor Contactor' },
    { type: 'output', address: 'Q0.1', label: 'Motor Run Indicator' },
  ],
  questions: [
    {
      id: 'dol_q1',
      title: 'Start Motor Dasar',
      description: 'Buat ladder diagram untuk menyalakan motor (Q0.0) ketika tombol start (I0.0) ditekan.',
      hint: 'Gunakan kontak NO (I0.0) yang terhubung ke coil (Q0.0)',
      expectedAnswer: [
        { type: 'contact_no', address: 'I0.0', rung: 0, position: 0 },
        { type: 'coil', address: 'Q0.0', rung: 0, position: 1 },
      ],
      maxRungs: 1,
    },
    {
      id: 'dol_q2',
      title: 'Stop Button',
      description: 'Tambahkan tombol stop (I0.1) yang bersifat NC. Motor mati ketika stop ditekan.',
      hint: 'Kontak NC (I0.1) ditempatkan sebelum kontak NO (I0.0)',
      expectedAnswer: [
        { type: 'contact_nc', address: 'I0.1', rung: 0, position: 0 },
        { type: 'contact_no', address: 'I0.0', rung: 0, position: 1 },
        { type: 'coil', address: 'Q0.0', rung: 0, position: 2 },
      ],
      maxRungs: 1,
    },
    {
      id: 'dol_q3',
      title: 'Latching Circuit',
      description: 'Buat latching agar motor tetap ON setelah tombol start dilepas. Gunakan kontak paralel Q0.0.',
      hint: 'Tambahkan kontak NO (Q0.0) paralel dengan kontak NO (I0.0)',
      expectedAnswer: [
        { type: 'contact_no', address: 'I0.0', rung: 0, position: 0 },
        { type: 'contact_no', address: 'Q0.0', rung: 0, position: 1 },
        { type: 'contact_nc', address: 'I0.1', rung: 0, position: 2 },
        { type: 'coil', address: 'Q0.0', rung: 0, position: 3 },
      ],
      maxRungs: 1,
    },
    {
      id: 'dol_q4',
      title: 'Overload Protection',
      description: 'Tambahkan proteksi overload (I0.2) bersifat NC. Motor mati otomatis saat overload.',
      hint: 'Kontak NC (I0.2) ditempatkan sebelum coil',
      expectedAnswer: [
        { type: 'contact_no', address: 'I0.0', rung: 0, position: 0 },
        { type: 'contact_no', address: 'Q0.0', rung: 0, position: 1 },
        { type: 'contact_nc', address: 'I0.1', rung: 0, position: 2 },
        { type: 'contact_nc', address: 'I0.2', rung: 0, position: 3 },
        { type: 'coil', address: 'Q0.0', rung: 0, position: 4 },
      ],
      maxRungs: 1,
    },
    {
      id: 'dol_q5',
      title: 'Run Indicator',
      description: 'Tambahkan indikator motor running (Q0.1) yang menyala saat motor ON.',
      hint: 'Gunakan rung terpisah dengan kontak Q0.0 untuk mengaktifkan Q0.1',
      expectedAnswer: [
        { type: 'contact_no', address: 'Q0.0', rung: 1, position: 0 },
        { type: 'coil', address: 'Q0.1', rung: 1, position: 1 },
      ],
      maxRungs: 2,
    },
    {
      id: 'dol_q6',
      title: 'Identifikasi Error',
      description: 'Manakah yang SALAH jika kontak stop (I0.1) menggunakan NO bukan NC?',
      hint: 'Stop button harus NC agar default-nya mengalirkan power',
      expectedAnswer: [
        { type: 'contact_no', address: 'I0.1', rung: 0, position: 0 },
        { type: 'contact_no', address: 'I0.0', rung: 0, position: 1 },
        { type: 'coil', address: 'Q0.0', rung: 0, position: 2 },
      ],
      maxRungs: 1,
    },
    {
      id: 'dol_q7',
      title: 'Dual Start Buttons',
      description: 'Buat kontrol dengan 2 tombol start (I0.0 dan I0.3) yang keduanya bisa menyalakan motor.',
      hint: 'Dua kontak NO (I0.0 dan I0.3) dipasang paralel',
      expectedAnswer: [
        { type: 'contact_no', address: 'I0.0', rung: 0, position: 0 },
        { type: 'contact_no', address: 'I0.3', rung: 0, position: 1 },
        { type: 'contact_no', address: 'Q0.0', rung: 0, position: 2 },
        { type: 'contact_nc', address: 'I0.1', rung: 0, position: 3 },
        { type: 'coil', address: 'Q0.0', rung: 0, position: 4 },
      ],
      maxRungs: 1,
    },
    {
      id: 'dol_q8',
      title: 'Motor dengan Delay Start',
      description: 'Motor (Q0.0) baru ON 5 detik setelah tombol start ditekan. Gunakan timer TON.',
      hint: 'Timer TON (T0) diaktifkan oleh start, output timer mengaktifkan motor',
      expectedAnswer: [
        { type: 'contact_no', address: 'I0.0', rung: 0, position: 0 },
        { type: 'timer_ton', address: 'T0', rung: 0, position: 1 },
        { type: 'contact_no', address: 'T0', rung: 1, position: 0 },
        { type: 'coil', address: 'Q0.0', rung: 1, position: 1 },
      ],
      maxRungs: 2,
    },
    {
      id: 'dol_q9',
      title: 'Interlock dengan Motor Lain',
      description: 'Motor A (Q0.0) hanya boleh ON jika Motor B (Q0.1) sedang OFF. Gunakan kontak NC Q0.1.',
      hint: 'Tambahkan kontak NC (Q0.1) di rung motor A',
      expectedAnswer: [
        { type: 'contact_no', address: 'I0.0', rung: 0, position: 0 },
        { type: 'contact_nc', address: 'Q0.1', rung: 0, position: 1 },
        { type: 'contact_nc', address: 'I0.1', rung: 0, position: 2 },
        { type: 'coil', address: 'Q0.0', rung: 0, position: 3 },
      ],
      maxRungs: 1,
    },
    {
      id: 'dol_q10',
      title: 'Full DOL Circuit',
      description: 'Buat ladder diagram lengkap DOL: start, stop NC, latch, overload NC, dan run indicator.',
      hint: 'Gabungkan semua konsep: latch dengan Q0.0, stop NC (I0.1), overload NC (I0.2), indicator di rung terpisah',
      expectedAnswer: [
        { type: 'contact_no', address: 'I0.0', rung: 0, position: 0 },
        { type: 'contact_no', address: 'Q0.0', rung: 0, position: 1 },
        { type: 'contact_nc', address: 'I0.1', rung: 0, position: 2 },
        { type: 'contact_nc', address: 'I0.2', rung: 0, position: 3 },
        { type: 'coil', address: 'Q0.0', rung: 0, position: 4 },
        { type: 'contact_no', address: 'Q0.0', rung: 1, position: 0 },
        { type: 'coil', address: 'Q0.1', rung: 1, position: 1 },
      ],
      maxRungs: 2,
    },
  ],
};
