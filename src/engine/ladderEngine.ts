import type { LadderElement } from '../store/userStore';

export interface IOState {
  inputs: Record<string, boolean>;
  outputs: Record<string, boolean>;
  timers: Record<string, { elapsed: number; done: boolean }>;
  counters: Record<string, { count: number; done: boolean }>;
}

export interface RungResult {
  energized: boolean;
  elements: { element: LadderElement; energized: boolean }[];
}

export function createInitialState(): IOState {
  return {
    inputs: {},
    outputs: {},
    timers: {},
    counters: {},
  };
}

export function evaluateRung(
  elements: LadderElement[],
  state: IOState
): RungResult {
  let powerFlow = true;
  const results: { element: LadderElement; energized: boolean }[] = [];

  for (const element of elements) {
    let elementEnergized = false;

    switch (element.type) {
      case 'contact_no':
        elementEnergized = powerFlow && (state.inputs[element.address] || false);
        break;
      case 'contact_nc':
        elementEnergized = powerFlow && !(state.inputs[element.address] || false);
        break;
      case 'coil':
        elementEnergized = powerFlow;
        if (powerFlow) {
          state.outputs[element.address] = true;
        } else {
          state.outputs[element.address] = false;
        }
        break;
      case 'timer_ton':
      case 'timer_tof':
        const timer = state.timers[element.address] || { elapsed: 0, done: false };
        elementEnergized = powerFlow;
        if (powerFlow && element.type === 'timer_ton') {
          timer.elapsed += 100;
          if (timer.elapsed >= 1000) {
            timer.done = true;
          }
        }
        state.timers[element.address] = timer;
        break;
      case 'counter_ctu':
        const counter = state.counters[element.address] || { count: 0, done: false };
        elementEnergized = powerFlow;
        if (powerFlow && !state.inputs['_prev_' + element.address]) {
          counter.count += 1;
          if (counter.count >= 5) {
            counter.done = true;
          }
        }
        state.counters[element.address] = counter;
        break;
    }

    results.push({ element, energized: elementEnergized });
    powerFlow = elementEnergized;
  }

  return {
    energized: powerFlow,
    elements: results,
  };
}

export function scanCycle(
  rungs: LadderElement[][],
  state: IOState
): RungResult[] {
  const results: RungResult[] = [];
  for (const rung of rungs) {
    results.push(evaluateRung(rung, state));
  }
  return results;
}

export function validateAnswer(
  userElements: LadderElement[],
  expectedElements: LadderElement[]
): { correct: boolean; score: number; feedback: string } {
  if (userElements.length !== expectedElements.length) {
    return {
      correct: false,
      score: 0,
      feedback: `Jumlah elemen salah. Diharapkan ${expectedElements.length}, ditemukan ${userElements.length}`,
    };
  }

  let matchCount = 0;
  for (let i = 0; i < expectedElements.length; i++) {
    const user = userElements[i];
    const expected = expectedElements[i];
    if (user.type === expected.type && user.address === expected.address) {
      matchCount++;
    }
  }

  const score = Math.round((matchCount / expectedElements.length) * 100);
  const correct = score === 100;

  let feedback = '';
  if (correct) {
    feedback = 'Benar! Ladder diagram sudah sempurna.';
  } else if (score >= 70) {
    feedback = `Hampir benar! ${matchCount}/${expectedElements.length} elemen sesuai. Periksa kembali.`;
  } else {
    feedback = `Perlu perbaikan. ${matchCount}/${expectedElements.length} elemen sesuai. Lihat hint untuk bantuan.`;
  }

  return { correct, score, feedback };
}
