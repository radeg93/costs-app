import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '@models/costs.interface';
import { CommentActionType, CommentType } from '@enums/costs.enum';

@Component({
	selector: 'app-add-comment',
	templateUrl: './add-comment.component.html',
	styleUrls: ['./add-comment.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCommentComponent implements OnInit {
	@Input() costItemId: number;
	@Input() comment: Comment;
	@Input() actionType: CommentActionType;

	@Output() addComment: EventEmitter<any> = new EventEmitter<any>();

	form: FormGroup;
	commentTypes: CommentType[] = [CommentType.Internal, CommentType.External];
	CommentActionType = CommentActionType;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			type: [this.comment?.type ?? '', Validators.required],
			text: [this.comment?.comment ?? '', Validators.required],
		});
	}

	saveComment = (event: any) => {
		event.preventDefault();
		let comment: Comment;
		if (this.comment) {
			comment = { ...this.comment, comment: this.form.value.text, date: new Date().toDateString(), type: this.form.value.type };
		} else {
			comment = {
				id: this.generateRandomId(1, 1000),
				author: 'Mr. Agency BO',
				comment: this.form.value.text,
				daStage: 'PDA',
				date: new Date().toDateString(),
				persona: 'BACKOFFICE',
				type: this.form.value.type,
			};
		}

		this.addComment.emit({ comment, costItemId: this.costItemId });
	};

	// Generate random number between min and max
	private generateRandomId = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
}
