import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Comment } from '@models/costs.interface';
import { CommentActionType, CommentType } from '@enums/costs.enum';
import { CostsService } from '@store/costs.service';

@Component({
	selector: 'app-comments',
	templateUrl: './comments.component.html',
	styleUrls: ['./comments.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent implements OnInit {
	@Input() comments: Array<Comment>;
	@Input() costItemId: number;

	editableCommentIds: number[] = [];
	CommentType = CommentType;
	CommentActionType = CommentActionType;

	constructor(private costsService: CostsService) {}

	ngOnInit(): void {}

	makeEditable = (commentId: number) => this.editableCommentIds.push(commentId);

	onEditComment = (event: any) => {
		this.costsService.editComment(this.costItemId, event.comment);
		this.editableCommentIds = this.editableCommentIds.filter((id: number) => id !== event.comment.id);
	};

	removeComment = (commentId: number) => {
		this.costsService.removeComment(commentId);
		this.editableCommentIds = this.editableCommentIds.filter((id: number) => id !== commentId);
	};

	isEditableComment = (commentId: number) => this.editableCommentIds.includes(commentId);
}
