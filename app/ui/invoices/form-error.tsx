export function FormError(props: { errors?: string[] | string; id: string }) {
  const { errors, id } = props;
  return (
    <div aria-atomic="true" aria-live="polite" id={id}>
      {errors === undefined
        ? null
        : (Array.isArray(errors) ? errors : [errors]).map((error) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
    </div>
  );
}
