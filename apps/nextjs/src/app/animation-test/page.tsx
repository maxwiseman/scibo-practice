import { Orb } from "../_components/orb";

export default function Page() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Orb />
      {/* <style>
        {`
          :root {
            --rotation: 0deg;
          }

          @property --rotation {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }


          @keyframes spin {
            from { --rotation: 0deg; }
            to { --rotation: 360deg; }
          }

          #test {
            width: 100px;
            height: 100px;
            background-color: red;
            animation: spin 2s linear infinite;
            transform: rotate3d(1,0,0,var(--rotate))
            transform-origin: bottom right 60px;
          }
          #test2 {
            width: 100px;
            height: 100px;
            background-color: green;
            animation: spin 5s linear infinite;
            transform-origin: bottom right 60px;
          }
          #test3 {
            width: 100px;
            height: 100px;
            background-color: blue;
            animation: spin 10s linear infinite;
            transform-origin: bottom right 60px;
          }
        `}
      </style> */}
      <div />
    </div>
  );
}
