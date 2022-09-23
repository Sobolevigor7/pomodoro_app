import React, { useRef, useState } from "react";
import styles from "./deletetask.module.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { remove } from "../../Main/TodoListContainer/TodoList";
import { EIcons, Icon } from "../../Icon";

type Props = {
  index: number;
};

export function DeleteTask({ index }: Props) {
  const [show, setShow] = useState(false);

  const ref = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setShow(false);
    ref.current?.blur();
  };

  const handleShow = () => {
    setShow(true);
    ref.current?.blur();
  };
  const handlConfButton = () => {
    setShow(false);
    ref.current?.blur();
    remove(index);
  };

  return (
    <>
      {" "}
      <button
        type="button"
        onClick={handleShow}
        ref={ref}
        className={styles.menuButton}
      >
        <Icon icon={EIcons.delete} className={styles.buttonImg} size={18} />
        Удалить
      </button>
      <Modal centered show={show} onHide={handleClose} className={styles.modal}>
        <Modal.Header className={styles.modalHeader}>
          <Modal.Title>Удалить задачу?</Modal.Title>

          <Modal.Footer className={styles.modalFooter}>
            <Button
              variant="danger"
              onClick={handlConfButton}
              className={styles.confButton}
            >
              Удалить
            </Button>
            <Button
              variant="outline-secondary"
              className={styles.rejectButton}
              onClick={handleClose}
            >
              Отмена
            </Button>
          </Modal.Footer>
        </Modal.Header>

        <Modal.Header
          className={styles.smallCloseButton}
          closeButton
        ></Modal.Header>
      </Modal>
    </>
  );
}
