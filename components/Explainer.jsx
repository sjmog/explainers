import React from "react";
import cx from "classnames";
import { Box } from "@primer/react";

import styles from "./Explainer.module.scss";

export const Explainer = ({
  children,
  className,
}) => {
  return (
    <div className={cx(styles.containerBox, className)}>
      <Box
        data-container="article"
        gridArea="content"
        data-search="article-body"
        className={cx(styles.articleContainer, className)}
      >
        {children}
      </Box>
    </div>
  );
};
