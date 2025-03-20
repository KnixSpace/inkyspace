import React, { forwardRef, Ref } from "react";

type Props = {};

const Content = (props: Props, ref: any) => {
  return <div ref={ref}>Content</div>;
};

export default forwardRef(Content);
