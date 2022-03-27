import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CostsComponent } from './components/costs/costs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainTableComponent } from './components/main-table/main-table.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommentsComponent } from './components/comments/comments.component';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [AppComponent, CostsComponent, MainTableComponent, CommentsComponent, AddCommentComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatSelectModule,
		MatIconModule,
		MatInputModule,
		MatButtonModule,
		ReactiveFormsModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
