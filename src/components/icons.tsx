import type { SVGProps } from 'react';

export function EnvisionOSLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>Envision OS Logo</title>
      <path d="M12 15a7 7 0 0 0 7-7 7 7 0 0 0-7-7 7 7 0 0 0-7 7 7 7 0 0 0 7 7Z" />
      <path d="M12 15v6" />
      <path d="M9 21h6" />
    </svg>
  );
}
