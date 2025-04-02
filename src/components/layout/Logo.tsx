import Link from "next/link";

type Props = {
  H1?: string;
  SPAN?: string;
};
const Logo = (props: Props) => {
  return (
    <Link href="/">
      <h1 className={props.H1}>
        <span className={`underline decoration-rose-400 ${props.SPAN}`}>
          Inky
        </span>
        <span className={`underline decoration-purple-500 ${props.SPAN}`}>
          Space
        </span>
      </h1>
    </Link>
  );
};

export default Logo;
