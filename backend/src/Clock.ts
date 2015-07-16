class Clock {

    private static now = Date.now();

    static getNow():number {
        return Clock.now;
    }

    static setNow(newNow:number) {
        Clock.now = newNow;
    }
}

export = Clock;