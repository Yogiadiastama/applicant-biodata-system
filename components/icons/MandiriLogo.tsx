
import React from 'react';

export const MandiriLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 200 60"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <style>
      {`.mandiri-text{font:bold 32px Arial,sans-serif;fill:#003d79}`}
    </style>
    <path
      d="m64.6 22.8c-2.4-1.2-5-2-7.5-2-5.7 0-9.6 3.1-9.6 7.7 0 3.7 2.3 5.9 6.2 7.3l2.8 1c3.1 1.1 4.8 2.5 4.8 4.8 0 2.8-2.3 4.6-5.6 4.6-3.2 0-6-1.5-8.2-2.9l-1.5-1v-6.3l1.5.8c2 1.2 4.1 2.1 6.5 2.1 5.3 0 8.6-2.6 8.6-7 0-4.3-3.2-6.3-7.1-7.8l-2.4-.9c-2.5-.9-4-2-4-4.1 0-2.1 1.8-3.7 4.5-3.7 2.6 0 5 1.2 7 2.4l1.2.7v6.1z"
      fill="#ffc72c"
    />
    <text className="mandiri-text" x="78" y="42">
      mandiri
    </text>
  </svg>
);
