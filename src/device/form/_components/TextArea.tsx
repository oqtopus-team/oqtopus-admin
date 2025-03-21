import { ComponentPropsWithRef, forwardRef } from 'react';

const TextArea = forwardRef<
  HTMLTextAreaElement,
  {
    label?: string;
    errorMessage?: string;
  } & ComponentPropsWithRef<'textarea'>
>(({ label, errorMessage, className, ...props }, ref) => {
  return (
    <>
      <textarea ref={ref} {...props} />
      {errorMessage ?? <p>{errorMessage}</p>}
    </>
  );
});
TextArea.displayName = 'TextArea';

export { TextArea };
