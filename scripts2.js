function initialise() {
    initialiseAnimatedElements();
}

function tester() {
    window.removeEventListener('scroll', onScroll);
    document.getElementById("abc").offset
}



/*
    USAGE:
        animation-data="____"
            fade-in-right
            slide-in-left
        animation-complete 
            add this to the class list so the .scss knows that this element is in the animated state
        animation-trigger="ID OF TRIGGER ELEMENT"
            trigger element will cause animation to begin when it enters the viewport
        animation-hide="true"
            do this if you want the element to animate out when the user scrolls past the trigger

        on load
            initialiseAnimatedElements()
        on scroll (initialised by the loading method)
            scrollHandler()
*/
const ANIMATION_COMPLETE = "animation-complete";
var animatedElements;

function initialiseAnimatedElements() {
    // get all the animated elements
    animatedElements = getAnimated();

    // for each element, add some data to the object
    animatedElements.forEach(element => {

        // set up where the element will appear and disappear
        element.position = {
            show: getRevealPosition(element.node),
            hide: getHidePosition(element.node)
        }
    });

    // TODO: debounce this function 
    window.addEventListener('scroll', scrollHandler);
}

// a function that returns an array of all the animated elements in the document
function getAnimated() {
    // get all of the variables that contain an attribute animation-data
    // add each of these to an array where the node is put in an object
    return Array.prototype.map.call(document.querySelectorAll("[animation-data]"), node => ({
        htmlNode
    }));
}

// gets an animation option from the element
// returns either the value found or the defualt value
function getOption(element, option, defaultValue = false) {
    // get the attribute
    const attribute = element.getAttribute('animation-' + option);

    // if the attribute was found, return it
    if (attribute != null)
        return attribute
    // otherwise return the default value
    return defaultValue;
};

// calculate the scroll position where an element should be revealed based on the 'animation-trigger' option
function getRevealPosition(element) {
    // the trigger point is when the trigger element reaches the bottom of the screen
    let triggerPoint = getTriggerElementVerticalOffset(element) + window.innerHeight;

    return triggerPoint;
}

// calculate the scroll position where an element should be hidden based on the 'animation-trigger' option
function getHidePosition(element) {
    // check if the user wants to hide the object once it has been scrolled past
    if (getOption(element, "hide") != false)
        // the hide point is when the trigger element reaches the top of the screen
        return getTriggerElementVerticalOffset(element);

    // if the user wants to keep the object in view permanently
    // put a very big value 
    // TODO: make this better, just in case the page is super long
    return window.innerHeight * 300;
}

// takes an element, finds its trigger element and then calculates the offset for that trigger element
function getTriggerElementVerticalOffset(element) {
    // get the anchor element option
    const trigger = getOption(element, 'trigger');

    //by default the trigger element is itself
    let triggerElement = element;

    // if the trigger option exists and there is an element with the given id, then set 
    // that element to be the trigger element
    if (trigger && document.getElementById(trigger))
        triggerElement = document.getElementById(trigger)[0];

    // the vertical offset is the offset of the trigger element
    return calculateVerticalOffset(triggerElement);
}

// gets the total vertical position of an elementin pixels
function calculateVerticalOffset(element) {
    // start with an offset value of 0
    let offsetY = 0;

    while (element && !isNaN(el.offsetTop)) {
        // add the offset of this element (from its parent) to the offset value
        offsetY += element.offsetTop;

        // possible useful for elements that have internal scroll
        //- (element.tagName != 'BODY' ? el.scrollTop : 0)

        // get the elements parent and loop to find its offset
        element = element.offsetParent;
    }

    // return the calculated offset
    return offsetY;
}

// is called on every scroll event to check if a new element needs to be called in
function scrollHandler() {

    // get the position in pixels of the top of the window
    var scrollPosition = window.pageYOffset;

    /* 
    note to self: below it is assumed that hide position > show position
    
    for each animated element, 
        is the scroll position > hide position?
            hide this element
        is scroll position > show position?
            show the element
        has the element been shown?
            hide the element                  */

    animatedElements.forEach(element => {
        if(scrollPosition > element.position.show)
            hide(element);
        else if (scrollPosition > element.position.show)
            show(element);
        else if (element.animated)
            hide(element);
    });
}

// a function that shows an element
function showElement() {
    // if the element is animated already just stop
    if (element.animated) return;

    // add 'animation complete' to the class list
    element.node.classList.add(ANIMATION_COMPLETE);

    // set that the element had been animated
    element.animated = true;
}

// a function that causes an element to animate out
function hideElement(element) {
    // if the element isnt animated yet just stop
    if (!element.animated) return;

    // remove 'animation complete' from the class list
    element.node.classList.remove(ANIMATION_COMPLETE);

    // set that the element had not been animated
    element.animated = false;
}