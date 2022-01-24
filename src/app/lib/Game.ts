import { BehaviorSubject } from "rxjs";
import { Field } from "./Field";

export interface GameOptions {
    fieldSize?: number,
    fieldDisplaySize?: number,
    keybinds?: {
        [key: string]: Action
    },
    debugKeybinds?: {
        [key: string]: DebugAction
    }
}

export enum Direction {
    Up,
    Right,
    Down,
    Left
}

export enum Action {
    MoveLeft = "mvL",
    MoveRight = "mvR",
    MoveUp = "mvU",
    MoveDown = "mvD"
}

export enum DebugAction {
    Transpose = "transpose",
    Slide = "slide",
    Combine = "combine",
    ApplyTransformations = "applytrans",
    Flip = "flip"
}

export class Game {
    field: Field;
    score = new BehaviorSubject(0);
    isGameOver = new BehaviorSubject(false);
    constructor(fieldContainer: HTMLElement, options?: GameOptions) {
        const { fieldSize, fieldDisplaySize, keybinds, debugKeybinds } = options ?? {};
        this.field = new Field(fieldContainer, { fieldSize, fieldDisplaySize });
        document.addEventListener("keydown", e => {
            if (this.isGameOver.value) return;
            if (e.repeat) return;

            let kbs = [];

            if (keybinds) {
                kbs.push(...Object.entries(keybinds));
            }
            if (debugKeybinds) {
                kbs.push(...Object.entries(debugKeybinds));
            }

            for (const [key, value] of kbs) {
                if (key === e.code) this.callAction(value);
            }
        })
    }

    addScore(pointsCount: number) {
        this.score.next(this.score.value + pointsCount);
    }

    callAction(action: Action | DebugAction) {
        switch (action) {
            case Action.MoveLeft:
                this.move(Direction.Left);
                break;
            case Action.MoveRight:
                this.move(Direction.Right);
                break;
            case Action.MoveUp:
                this.move(Direction.Up);
                break;
            case Action.MoveDown:
                this.move(Direction.Down);
                break;
            case DebugAction.Slide:
                this.field.slide();
                break;
            case DebugAction.Combine:
                this.field.combine();
                break;
            case DebugAction.Transpose:
                this.field.transpose();
                break;
            case DebugAction.ApplyTransformations:
                this.field.applyTransformations();
                break;
            case DebugAction.Flip:
                this.field.flip();
                break;
        }
    }

    move(direction: Direction) {
        this.field.saveField();
        switch (direction) {
            case Direction.Left:
                this.field.slide();
                this.addScore(this.field.combine());
                this.field.slide();
                break;
            case Direction.Right:
                this.field.flip();

                this.field.slide();
                this.addScore(this.field.combine());
                this.field.slide();

                this.field.flip();
                this.field.applyTransformations();
                break;
            case Direction.Up:
                this.field.flip();
                this.field.transpose();

                this.field.slide();
                this.addScore(this.field.combine());
                this.field.slide();

                this.field.transpose();
                this.field.flip();
                this.field.applyTransformations();
                break;
            case Direction.Down:
                this.field.transpose();
                this.field.flip();
                
                this.field.slide();
                this.addScore(this.field.combine());
                this.field.slide();
                
                this.field.flip();
                this.field.transpose();
                this.field.applyTransformations();
                break;
        }
        this.field.applyTransformations();
        if (!this.field.canMove()) this.isGameOver.next(true);
        else {
            this.isGameOver.next(false);
            if (this.field.isSpaceAvailable() && this.field.hasChanged()) this.field.addRandomCell();
        }
    }
}