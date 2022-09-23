import React, { useRef, useState } from "react";
import styles from "./fullreset.module.css";
import { resetTodo } from "../../Main/TodoListContainer/TodoList";
import { resetGlobal } from "../../GlobalStorage";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export function FullReset() {
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
    resetTodo();
    resetGlobal();
    window.location.reload();
    setShow(false);
    ref.current?.blur();
  };

  return (
    <>
      {" "}
      <Button variant="outline-danger" onClick={handleShow} ref={ref}>
        Сброс статистики
      </Button>
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Внимание!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вся статистика по работе, а также все текущие задачи будут удалены!
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            className={styles.rejectButton}
            onClick={handleClose}
          >
            Отменить
          </Button>
          <Button variant="danger" onClick={handlConfButton}>
            Стереть данные
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
