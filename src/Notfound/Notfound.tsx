import React from "react";
import styles from "./Notfound.module.css";
import { EIcons, Icon } from "../Icon";
import Container from "react-bootstrap/Container";

export function Notfound() {
  return (
    <Container>
      <div className={styles.container}>
        <div>
          ОШИБКА 404 <p>НИЧЕГО НЕ НАЙДЕНО!!!</p>
        </div>
        <Icon icon={EIcons.p404} size={400} />
      </div>
    </Container>
  );
}
