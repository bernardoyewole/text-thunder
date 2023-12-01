'use strict';

export default 'Score';

export class Score {
    #data;
    #hits;
    #percentage;

    constructor(data, hits, percentage) {
        this.#data = data;
        this.#hits = hits;
        this.#percentage = percentage;
    }

    get data() {
        return this.#data;
    }

    get hits() {
        return this.#hits;
    }

    get percentage() {
        return this.#percentage
    }
}