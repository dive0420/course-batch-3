'use strict';
const assert = require('chai').assert;
const HTMLParser = require('../HTMLParser');

describe('Tags validations: ', () => {
    
    it('valid tag', () => {
        const textLine = '<div data-item="data1" data-value="value1"></div>';
        const result_parser = HTMLParser.isValidTag(textLine);
        assert.isTrue(result_parser);
    });

    if('valid tag witout close tag', () =>{
        const textsLines = ['<br />', '<input type="text" name="" />'];
        let result_parser = false;
        for(const textLine of textsLines){
            result_parser = HTMLParser.isValidTag(textLine);
            assert.isTrue(result_parser);
        }
    });

    it('Invalid tag', () => {
        const textLine = '<novalid data-item="data1" data-value="value1"></novalid>';
        const result_parser = HTMLParser.isValidTag(textLine);
        assert.isFalse(result_parser);
    });

    it('start tag without close tag', () => {
        const textLine = '<div data-item="data1" data-value="value1">Foo</novalid>';
        const result_parser = HTMLParser.isValidTag(textLine);
        assert.isFalse(result_parser);
    });
});

describe('Test Parser: ', () => {

    it('Test get HTML tag', () =>{
        const textLine = '<div data-value="value1">text1<p>foo</p></div><div>text2</div>';
        const expect_value = {
            HTMLTag: '<div data-value="value1">',
            content: 'text1<p>foo</p>',
            pending: '<div>text2</div>'
        };
        const result = HTMLParser.nextHTMLTag(textLine);
        assert.deepEqual(result, expect_value);
    });

    it('Test get HTML tag in TextLine that starts with text', () =>{
        const textLine = 'Lorem ipsum<div data-value="value1">text1<p>foo</p></div><div>text2</div>';
        const expect_value = {
            HTMLTag: '<div data-value="value1">',
            content: 'text1<p>foo</p>',
            pending: '<div>text2</div>'
        };
        const result = HTMLParser.nextHTMLTag(textLine);
        assert.deepEqual(result, expect_value);
    });

    it('Tree generation of elements of a valid text line', () => {
        const textLine = '<html><head><title></title></head><body style="color:red;"><div><h1>Title 1</h1><p>Hello World</p></div></body></html>';
        const expect_value = {
            name: 'html', tag: 'html', attributes: [],
            nodes: [
                { name: 'head', tag: 'head', attributes: [],nodes: [] },
                { name: 'title', tag: 'title', attributes: [], nodes: [] },
                { name: 'body', tag: 'body', attributes: [], nodes: [
                    { name: 'div', tag: 'div', attributes: [], nodes: [
                        { name: 'h1', tag: 'h1', attributes: [], nodes: [] },
                        { name: 'p', tag: 'p', attributes: [], nodes: [] }
                    ]},]
                },
            ]};
        const result_parser = HTMLParser.extractElements(textLine);
        assert.deepEqual(result_parser, expect_value);
    });
    it('Tree generation of elements of an invalid line of text', () => {
        const textLine = '<novalid></novalid>';
        const expect_value = {};
        const result_parser = HTMLParser.extractElements(textLine);
        assert.deepEqual(result_parser, expect_value);
    });
});

describe('Test Read attributes from element: ', () => {
    it('Valid attributes', () => {
        const textLine = '<p data-item="item1" data-value="value1"></p>';
        const expect_value = [
            {key: 'data-item', value:"item1"},
            {key: 'data-item', value:"value1"},
        ];
        const result = HTMLParser.extractAttributes(textLine);
        assert.deepEqual(result, expect_value);
    });
    it('No attribute', () => {
        const textLine = '<p></p>';
        const expect_value = [];
        const result = HTMLParser.extractAttributes(textLine);
        assert.deepEqual(result, expect_value);
    });
    it('Invalid attributes', () => {
        const textLine = '<p data-item:"item1" data-value:"value1"></p>';
        const expect_value = [];
        const result = HTMLParser.extractAttributes(textLine);
        assert.deepEqual(result, expect_value);
    });
    it('Invalid and Valid attributes', () => {
        const textLine = '<p data-item="item1" data-value:"value1"></p>';
        const expect_value = [
            {key: 'data-item', value:"item1"},
        ];
        const result = HTMLParser.extractAttributes(textLine);
        assert.deepEqual(result, expect_value);
    });
});
