import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest'
import Task from '@/app/tasklist/[...taskID]/Task'; 

vi.mock('next/image', () => ({
    __esModule: true,
    default: ({src,alt}:{src:string,alt:string}) => <img src={src} alt={alt} />
}))

const taskMock = {
    id: "1",
    name: "Test Task",
    completed: false,
};

const onCheckboxChangeMock = vi.fn();
const onEditTaskSaveMock = vi.fn();
const onDeleteTaskMock = vi.fn();

describe("Task Component",()=>{
    afterEach(() => {
        vi.clearAllMocks();
    });
    it("should render and allow the owner/editor to click the checkbox",()=>{
        render(
            <Task 
                task={taskMock}
                isOwnerOrEditor={true}
                onCheckboxChange={onCheckboxChangeMock}
                onEditTaskSave={onEditTaskSaveMock}
                onDeleteTask={onDeleteTaskMock}
            />
        );
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        expect(onCheckboxChangeMock).toHaveBeenCalledWith({...taskMock,completed:true});
    });
    it("should render and allow the viewer to click the checkbox",()=>{
        render(
            <Task 
                task={taskMock}
                isOwnerOrEditor={false}
                onCheckboxChange={onCheckboxChangeMock}
                onEditTaskSave={onEditTaskSaveMock}
                onDeleteTask={onDeleteTaskMock}
            />
        );
        const checkbox = screen.queryByRole("checkbox");
        expect(checkbox).not.toBeInTheDocument();
    })
    it("should allow the owner/editor to enter edit mode",()=>{
        render(
            <Task 
                task={taskMock}
                isOwnerOrEditor={true}
                onCheckboxChange={onCheckboxChangeMock}
                onEditTaskSave={onEditTaskSaveMock}
                onDeleteTask={onDeleteTaskMock}
            />
        );
        const editButton = screen.getByRole("button",{name:"Edit"});
        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);
        const input = screen.getByDisplayValue(taskMock.name);
        expect(input).toBeInTheDocument(); 
    })
    it("should not allow viewers to enter edit mode",()=>{
        render(
            <Task 
                task={taskMock}
                isOwnerOrEditor={false}
                onCheckboxChange={onCheckboxChangeMock}
                onEditTaskSave={onEditTaskSaveMock}
                onDeleteTask={onDeleteTaskMock}
            />
        );
        const editButton = screen.queryByRole("button",{name:"Edit"});
        expect(editButton).not.toBeInTheDocument();
    })
    it("should allow the owner/editor to save the edited task", () => {
        render(
          <Task
            task={taskMock}
            isOwnerOrEditor={true}
            onCheckboxChange={onCheckboxChangeMock}
            onEditTaskSave={onEditTaskSaveMock}
            onDeleteTask={onDeleteTaskMock}
          />
        );
        fireEvent.click(screen.getByRole("button",{ name:"Edit" }));
        const input = screen.getByDisplayValue(taskMock.name);
        fireEvent.change(input, {target:{ value:"Edited Task" }});
        const saveButton = screen.getByRole("button",{ name:"Save" });
        fireEvent.click(saveButton);
        expect(onEditTaskSaveMock).toHaveBeenCalledWith(taskMock.id,"Edited Task",taskMock.completed);
    })
    it("should not allow viewers to save edits", () => {
        render(
          <Task
            task={taskMock}
            isOwnerOrEditor={false}
            onCheckboxChange={onCheckboxChangeMock}
            onEditTaskSave={onEditTaskSaveMock}
            onDeleteTask={onDeleteTaskMock}
          />
        );
        const saveButton = screen.queryByRole("button",{ name:"Save" });
        expect(saveButton).not.toBeInTheDocument();
    });
    it("should allow the owner/editor to delete the task", () => {
        render(
          <Task
            task={taskMock}
            isOwnerOrEditor={true}
            onCheckboxChange={onCheckboxChangeMock}
            onEditTaskSave={onEditTaskSaveMock}
            onDeleteTask={onDeleteTaskMock}
          />
        );
        const deleteButton = screen.getByRole("button",{ name:"Delete" });
        fireEvent.click(deleteButton);
        expect(onDeleteTaskMock).toHaveBeenCalledWith(taskMock.id);
    })
    it("should not allow viewers to delete the task", () => {
        render(
          <Task
            task={taskMock}
            isOwnerOrEditor={false}
            onCheckboxChange={onCheckboxChangeMock}
            onEditTaskSave={onEditTaskSaveMock}
            onDeleteTask={onDeleteTaskMock}
          />
        );
        const deleteButton = screen.queryByRole("button",{ name:"Delete" });
        expect(deleteButton).not.toBeInTheDocument();
    });
})