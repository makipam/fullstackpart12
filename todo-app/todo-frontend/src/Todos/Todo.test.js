import List from "./List";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Testing todo element", () => {
  const handleDeleteClick = jest.fn();
  const handleCompleteClick = jest.fn();
  const todos = [
    { _id: "62d6759b423e8996f6a3aebd", text: "Write code", done: false },
  ];

  beforeEach(() => {
    render(
      <List
        todos={todos}
        deleteTodo={handleDeleteClick}
        completeTodo={handleCompleteClick}
      />
    );
  });
  test("it is possible to add a new todo", () => {
    const elementText = screen.getByText("Write code");
    expect(elementText).toBeDefined();
  });

  test("it is possible to click set as done button", async () => {
    await userEvent.click(screen.getByText("Set as done"));
    expect(handleCompleteClick).toHaveBeenCalledTimes(1);
  });
});
