import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import draftToMarkdown from 'draftjs-to-markdown';
import '../../assets/css/editor';

const rawContentState = {
	entityMap: { '0': { type: 'IMAGE', mutability: 'MUTABLE', data: { src: 'http://i.imgur.com/aMtBIep.png', height: 'auto', width: '100%' } } },
	blocks: [{ key: '9unl6', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }, { key: '95kn', text: ' ', type: 'atomic', depth: 0, inlineStyleRanges: [], entityRanges: [{ offset: 0, length: 1, key: 0 }], data: {} }, { key: '7rjes', text: '', type: 'unstyled', depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }]
};

class TextEditor extends Component {
	state = {
		editorContent: undefined,
		contentState: rawContentState,
		editorState: ''
	};

	onEditorChange = editorContent => {
		this.setState({
			editorContent
		});
	};

	clearContent = () => {
		this.setState({
			contentState: ''
		});
	};

	onContentStateChange = contentState => {
		console.log('contentState', contentState);
	};

	onEditorStateChange = editorState => {
		this.setState({
			editorState
		});
	};

	imageUploadCallBack = file =>
		new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
			xhr.open('POST', 'https://api.imgur.com/3/image');
			xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
			const data = new FormData(); // eslint-disable-line no-undef
			data.append('image', file);
			xhr.send(data);
			// xhr.addEventListener('load', () => {
			// 	const response = xhr.responseText && JSON.parse(xhr.responseText);
			// 	resolve(response);
			// });
			// xhr.addEventListener('error', () => {
			// 	debugger
			// 	const error = xhr.responseText && JSON.parse(xhr.responseText);
			// 	reject(error);
			// });
		});

	render() {
		const { editorContent, editorState } = this.state;
		return (
			<div className="shadow-radius">
				<div className="gutter-example button-demo editor-demo">
					<Row gutter={16} style={{padding:'0 5px'}}>
						<Col className="gutter-row" md={24} >
							<div className="gutter-box">
								<Card title="富文本编辑器" bordered={false}>
									<Editor
										editorState={editorState}
										toolbarClassName="home-toolbar"
										wrapperClassName="home-wrapper"
										editorClassName="home-editor"
										onEditorStateChange={this.onEditorStateChange}
										toolbar={{
											history: { inDropdown: true },
											inline: { inDropdown: false },
											list: { inDropdown: true },
											textAlign: { inDropdown: true },
											image: { uploadCallback: this.imageUploadCallBack }
										}}
										onContentStateChange={this.onEditorChange}
										placeholder="请输入正文~~尝试@哦，有惊喜"
										spellCheck
										onFocus={() => {
											console.log('focus');
										}}
										onBlur={() => {
											console.log('blur');
										}}
										onTab={() => {
											console.log('tab');
											return true;
										}}
										localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
										mention={{
											separator: ' ',
											trigger: '@',
											caseSensitive: true,
											suggestions: [{ text: 'A', value: 'AB', url: 'href-a' }, { text: 'AB', value: 'ABC', url: 'href-ab' }, { text: 'ABC', value: 'ABCD', url: 'href-abc' }, { text: 'ABCD', value: 'ABCDDDD', url: 'href-abcd' }, { text: 'ABCDE', value: 'ABCDE', url: 'href-abcde' }, { text: 'ABCDEF', value: 'ABCDEF', url: 'href-abcdef' }, { text: 'ABCDEFG', value: 'ABCDEFG', url: 'href-abcdefg' }]
										}}
									/>
								</Card>
							</div>
						</Col>
						<Col className="gutter-row" md={8}>
							<Card title="同步转换HTML" bordered={false}>
								<pre>{draftToHtml(editorContent)}</pre>
							</Card>
						</Col>
						<Col className="gutter-row" md={8}>
							<Card title="同步转换MarkDown" bordered={false}>
								<pre style={{ whiteSpace: 'pre-wrap' }}>{draftToMarkdown(editorContent)}</pre>
							</Card>
						</Col>
						<Col className="gutter-row" md={8}>
							<Card title="同步转换JSON" bordered={false}>
								<pre style={{ whiteSpace: 'normal' }}>{JSON.stringify(editorContent)}</pre>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default TextEditor;
