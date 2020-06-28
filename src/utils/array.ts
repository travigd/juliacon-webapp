/**
 * Interleave an array with elements generated by the given function.
 *
 * Returns an array of length 2n - 1 where the odd elements are those generated
 * by `fn`.
 */
export function interleave<TElt>(
  array: readonly TElt[],
  fn: (prev: TElt, next: TElt, idx: number) => TElt
): TElt[] {
  return array.reduce((result: TElt[], elt, idx) => {
    result.push(elt);
    // Don't insert at the end of the array
    if (idx === array.length - 1) return result;
    result.push(fn(elt, array[idx + 1], idx));
    return result;
  }, []);
}

export function interleaveMap<TIn, TOut>(
  array: readonly TIn[],
  mapper: (elt: TIn, idx: number) => TOut,
  fn: (idx: number) => TOut
) {
  return interleave(array.map(mapper), (_p, _n, index) => fn(index));
}
