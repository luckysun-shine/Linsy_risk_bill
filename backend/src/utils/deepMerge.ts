/** Deep-merge plain objects; arrays and primitives from source replace target. */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>
): T {
  const output: Record<string, unknown> = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;

    const existing = output[key];
    if (
      isPlainObject(existing) &&
      isPlainObject(value)
    ) {
      output[key] = deepMerge(
        existing as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else {
      output[key] = value;
    }
  }

  return output as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

export function departmentEmployeeId(year: number, deptCode: string): string {
  return `DEPT_${year}_${deptCode}`.toUpperCase();
}
