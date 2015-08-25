/* @flow */
//jshint ignore:start

var _ = require('lodash');
var $ = require('jquery');

export type Options = {
	widthBuffer?: ?number;
	heightBuffer?: ?number;
	leftBuffer?: ?number;
	topBuffer?: ?number;
	isBottomAligned?: ?boolean;
	isTopAligned?: ?boolean;
	isRightAligned?: ?boolean;
	isAligned?: ?boolean;
	forceFit?: ?boolean;
};

type Coord = {
	x: number;
	y: number;
};

type BoundingBox = [Coord, Coord];

// You may want to try ./contain-by-screen2 instead.

export default function containByScreen(element: HTMLElement, anchorPoint: HTMLElement, _options?: ?Options){
	if(element.style.position !== 'fixed'){
		return;
	}

    var options: Options = _options || {};

    var $element = $(element);
    var $anchorPoint = $(anchorPoint);

    var elementOffset = toOffset(element.getBoundingClientRect());
    var elementSizeBox = {
        width: $element.outerWidth(),
        height: $element.outerHeight(),
        innerWidth: $element.width()
    };

    if(options.widthBuffer){
        elementSizeBox.width += options.widthBuffer;
    }

    if(options.heightBuffer){
        elementSizeBox.height += options.heightBuffer;
    }

    var anchorOffset = toOffset(anchorPoint.getBoundingClientRect());
    var anchorSizeBox = {
        width: $anchorPoint.outerWidth(),
        height: $anchorPoint.outerHeight()
    };

    var screenBoundingBox = [
        {
            x: 0,
            y: 0
        },
        {
            x: window.innerWidth,
            y: window.innerHeight
        }
    ];

    var elementLeft = elementOffset.left;
    var elementTop = elementOffset.top;

    if(options.leftBuffer){
        elementLeft -= options.leftBuffer;
    }

    if(options.topBuffer){
        elementTop += options.topBuffer;
    }

    var elementBoundingBox = [
        {
            x: elementLeft,
            y: elementTop
        },
        {
            x: elementLeft + elementSizeBox.width,
            y: elementTop + elementSizeBox.height
        }
    ];

    var newTop, newLeft, newBottom, newRight;


    if(options.isBottomAligned){
        newBottom = document.body.clientHeight - anchorOffset.top;
        elementOffset.top = newBottom - elementSizeBox.height;
    }
    else{
        newTop = anchorOffset.top;

        if(!options.isTopAligned){
           newTop += anchorSizeBox.height;
        }

        elementOffset.top = newTop;
    }

    if(options.isRightAligned){
        newRight = document.body.clientWidth - anchorOffset.left - anchorSizeBox.width;
        elementOffset.left = newRight - elementSizeBox.width;
    }
    else if(!options.isAligned){
        newLeft = anchorOffset.left;
        elementOffset.left = newLeft;
    }


    var trialBoundingBox;
    //there are four possible "positions" right-aligned above anchor, right-aligned below, left-aligned above anchor, left-aligned below
    //first let's see if our default position is valid
    if(elementOffset.top + elementSizeBox.height > screenBoundingBox[1].y){
        //we are too tall, so let's try moving above
        trialBoundingBox = _.clone(elementBoundingBox);
        if(options.isAligned){
            trialBoundingBox[0].y = anchorOffset.top + anchorSizeBox.height - elementSizeBox.height;
        }
        else{
            trialBoundingBox[0].y = anchorOffset.top - elementSizeBox.height;
        }

        trialBoundingBox[1].y = trialBoundingBox[0].y + elementSizeBox.height;

        if(isYBounded(screenBoundingBox, trialBoundingBox)){
            newTop = trialBoundingBox[0].y;
        }
    }
    else if(elementOffset.top < 0){
        //we are above the rafters, so let's try moving down
        trialBoundingBox = _.clone(elementBoundingBox);
        if(options.isAligned){
            trialBoundingBox[0].y = anchorOffset.top;
        }
        else{
            trialBoundingBox[0].y = anchorOffset.top + anchorSizeBox.height;
        }

        trialBoundingBox[1].y = trialBoundingBox[0].y + elementSizeBox.height;

        if(isYBounded(screenBoundingBox, trialBoundingBox)){
            newTop = trialBoundingBox[0].y;
        }
    }

    if(newTop == null && options.forceFit){
        if(elementOffset.top < 0){
            //how much are we above?
            newTop = 0;
        }
        else if(elementOffset.top + elementSizeBox.height > screenBoundingBox[1].y){
            newTop = screenBoundingBox[1].y - elementSizeBox.height;
        }
    }

    if(elementOffset.left + elementSizeBox.width > screenBoundingBox[1].x){
        //we are too far to the right
        trialBoundingBox = _.clone(elementBoundingBox);
        if(options.isAligned){
            trialBoundingBox[0].x = anchorOffset.left - elementSizeBox.width;
        }
        else{
            trialBoundingBox[0].x = anchorOffset.left - elementSizeBox.width + anchorSizeBox.width;
        }

        trialBoundingBox[1].x = trialBoundingBox[0].x + elementSizeBox.width;

        if(isXBounded(screenBoundingBox, trialBoundingBox)){
            newLeft = trialBoundingBox[0].x;
        }
    }
    else if(elementOffset.left < 0){
        //too far to the left
        trialBoundingBox = _.clone(elementBoundingBox);
        if(options.isAligned){
            trialBoundingBox[0].x = anchorOffset.left + anchorSizeBox.width + elementSizeBox.width;
        }
        else{
            trialBoundingBox[0].x = anchorOffset.left;
        }

        trialBoundingBox[1].x = trialBoundingBox[0].x + elementSizeBox.width;

        if(isXBounded(screenBoundingBox, trialBoundingBox)){
            newLeft = trialBoundingBox[0].x;
        }
    }

    if(newBottom != null){
        element.style.bottom = _.round(newBottom) + 'px';
        element.style.top = '';
    }
    else if(newTop != null){
        element.style.top = _.round(newTop) + 'px';
        element.style.bottom = '';
    }

    if(newRight != null){
        element.style.right = _.round(newRight) + 'px';
        element.style.left = '';
    }
    else if(newLeft != null){
        element.style.left = _.round(newLeft) + 'px';
        element.style.right = '';
    }
}

var CONSTANTS = {
    BUFFER: 10
};

function isYBounded(containerBB: BoundingBox, containedBB: BoundingBox): boolean {
    if(containerBB[0].y - CONSTANTS.BUFFER > containedBB[0].y){
        return false;
    }

    if(containerBB[1].y + CONSTANTS.BUFFER < containedBB[1].y){
        return false;
    }

    return true;
}

function isXBounded(containerBB: BoundingBox, containedBB: BoundingBox): boolean {
    if(containerBB[0].x - CONSTANTS.BUFFER > containedBB[0].x){
        return false;
    }

    if(containerBB[1].x + CONSTANTS.BUFFER < containedBB[1].x){
        return false;
    }

    return true;
}

function toOffset(obj: {top: number, left: number}) {
	return {top: obj.top, left: obj.left};
}
