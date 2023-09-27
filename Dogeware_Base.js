const _console = console;
const serverUrl = 'https://sub2krunkercentral.com';
const version = '1.4';

fetch(`${serverUrl}/current-version`)
    .then((response) => response.text())
    .then((text) => {
        if (text !== version) {
            const confirmation = confirm(`This version of the cheat is no longer working, we have released a new version of the cheat (${version} -> ${text}),\n\nPress OK to be directed to Krunkercentral.com, once you're there download the hack from the latest post`);
            if (confirmation) {
                location.href = 'https://krunkercentral.com/';
            }
        }
    });

const id = `_${Math.random().toString(36).slice(2)}`;
window[id] = cheat;

function cheat() {
    delete window[id];
    class DogeWare {
        constructor() {
            this.hash = this.genHash(8);
            window[this.hash] = this;
            this.settings = {
                aimbot: 0,
                superSilent: false,
                AImbot: false,
                frustumCheck: false,
                weaponZoom: 1,
                wallbangs: false,
                alwaysAim: false,
                pitchHack: 0,
                thirdPerson: false,
                autoReload: false,
                rangeCheck: false,
                alwaysTrail: false,
                spinAimFrames: 10,
                animatedBillboards: false,
                esp: 0,
                espFontSize: 10,
                tracers: false,
                showGuiButton: true,
                awtv: false,
                uwtv: false,
                forceUnsilent: false,
                bhop: 0,
                spinBot: false,
                markTarget: true,
                skinHack: false,
                aimOffset: 0,
                aimNoise: 0,
                keybinds: true,
                fovbox: false,
                drawFovbox: false,
                fovBoxSize: 1,
                guiOnMMB: false,
                hideAdverts: false,
                hideStreams: false,
                hideMerch: false,
                hideNewsConsole: false,
                hideCookieButton: false,
                chams: false,
                chamsCol: 1,
                wireframe: false,
                customCSS: '',
                teamChams: false,
                autoNuke: false,
                chamsInterval: 500,
                preventMeleeThrowing: false,
                forceNametagsOn: false,
                aimbotRange: 0,
                autoServer: true,
                botNametags: true,
            };
            this.state = {
                bindAimbotOn: true,
                quickscopeCanShoot: true,
                spinFrame: 0,
                pressedKeys: new Set(),
                spinCounter: 0,
                activeTab: 0,
                nameTags: false,
                frame: 0,
            };
            this.rainbow = 0;
            this.colors = {
                White: '#FFFFFF',
                Black: '#000000',
                Purple: '#9400D3',
                Pink: '#FF1493',
                Blue: '#1E90FF',
                DarkBlue: '#0000FF',
                Aqua: '#00FFFF',
                Green: '#008000',
                Lime: '#7FFF00',
                Orange: '#FF8C00',
                Yellow: '#FFFF00',
                Red: '#FF0000',
            };
            this.isProxy = Symbol('isProxy');
            this.GUI = {};
            try {
                this.onLoad();
            } catch (err) {
                _console.error(`ERROR ${err.name}`);
                _console.error(err.message);
                _console.log(err.stack);
            }
        }

        // Event fired whenever the game loads
        onLoad() {
            this.defines();
            this.createListeners();
        }

        // Function to hook values that are used later on
        defines() {
            const origSkinsSymbol = Symbol('origSkins');
            const localSkinsSymbol = Symbol('localSkins');
            Object.defineProperties(Object.prototype, {
                canvas: {
                    set(canvas) {
                        this._canvas = canvas;
                        if (canvas.id !== 'game-overlay') {
                            return;
                        }
                        Dogeware_inst.overlay = this;
                        Dogeware_inst.ctx = canvas.getContext('2d');
                        Object.defineProperties(this, {
                            render: {
                                set(val) {
                                    this._render = new Proxy(val, {
                                        apply(_target, _that, args) {
                                            ['scale', 'game', 'controls', 'renderer', 'me'].forEach((name, index) => {
                                                Dogeware_inst[name] = args[index];
                                            });
                                            Reflect.apply(...arguments);
                                            if (Dogeware_inst.isDefined(Dogeware_inst.renderer) && Dogeware_inst.isDefined(Dogeware_inst.renderer.adsFov)) {
                                                try {
                                                    Dogeware_inst.renderer.adsFov.fill(Dogeware_inst.settings.weaponZoom);
                                                } catch (err) {
                                                    _console.error(err);
                                                }
                                            }
                                            if (!(Dogeware_inst.me && Dogeware_inst.ctx)) {
                                                return;
                                            }
                                            Dogeware_inst.ctx.save();
                                            Dogeware_inst.ctx.scale(Dogeware_inst.scale, Dogeware_inst.scale);
                                            Dogeware_inst.render();
                                            Dogeware_inst.ctx.restore();
                                            if (!Dogeware_inst.me.procInputs[Dogeware_inst.isProxy]) {
                                                Dogeware_inst.me.procInputs = new Proxy(Dogeware_inst.me.procInputs, {
                                                    apply(_target, that, [input, game, recon, lock]) {
                                                        if (that) {
                                                            Dogeware_inst.inputs(input);
                                                        }
                                                        return Reflect.apply(...arguments);
                                                    },
                                                    get(target, key) {
                                                        if (key === Dogeware_inst.isProxy) {
                                                            return true;
                                                        }
                                                        return Reflect.get(target, key);
                                                    },
                                                });
                                            }
                                            Dogeware_inst.game.map.manager.objects
                                                .filter((obj) => obj.penetrable)
                                                .map((obj, _index, _array) => {
                                                    obj.transparent = Dogeware_inst.settings.wallbangs;
                                                    return obj;
                                                });
                                        },
                                    });
                                },
                                get() {
                                    return this._render;
                                },
                            },
                        });
                    },
                    get() {
                        return this._canvas;
                    },
                },
                OBJLoader: {
                    set(val) {
                        Dogeware_inst.three = this;
                        this._value = val;
                    },
                    get() {
                        return this._value;
                    },
                },
                skins: {
                    set(val) {
                        this[origSkinsSymbol] = val;
                        if (this.localSkins === undefined || !this.localSkins.length) {
                            const skinCount = 1;
                            this[localSkinsSymbol] = Array(...Array(25_000)).map((_item, index) => ({
                                ind: index,
                                cnt: skinCount,
                            }));
                        }
                    },
                    get() {
                        if (Dogeware_inst.settings.skinHack && this.stats) {
                            return this[localSkinsSymbol];
                        }
                        return this[origSkinsSymbol];
                    },
                },
                useLooseClient: {
                    enumerable: false,
                    get() {
                        return this._ulc;
                    },
                    set(val) {
                        Dogeware_inst.config = this;
                        Object.defineProperty(this, 'nameVisRate', {
                            value: 0,
                            writable: false,
                            configurable: true,
                        });
                        this._ulc = val;
                    },
                },
                trail: {
                    enumerable: false,
                    get() {
                        return Dogeware_inst.settings.alwaysTrail || this._trail;
                    },
                    set(val) {
                        this._trail = val;
                    },
                },
                showTracers: {
                    enumerable: false,
                    get() {
                        return Dogeware_inst.settings.alwaysTrail || this._showTracers;
                    },
                    set(val) {
                        this._showTracers = val;
                    },
                },
                shaderId: {
                    enumerable: false,
                    get() {
                        if (this.src?.startsWith('pubs/')) {
                            if (Dogeware_inst.settings.animatedBillboards) {
                                return 1;
                            }
                            return this.rshaderId;
                        }
                        return this.rshaderId;
                    },
                    set(val) {
                        this.rshaderId = val;
                    },
                },
                idleTimer: {
                    enumerable: false,
                    get() {
                        if (Dogeware_inst.settings.antikick) {
                            return 0;
                        }
                        return this._idleTimer;
                    },
                    set(val) {
                        this._idleTimer = val;
                    },
                },
                kickTimer: {
                    enumerable: false,
                    get() {
                        if (Dogeware_inst.settings.antikick) {
                            return Infinity;
                        }
                        return this._kickTimer;
                    },
                    set(val) {
                        this._kickTimer = val;
                    },
                },
                cnBSeen: {
                    set(val) {
                        this.inView = val;
                    },
                    get() {
                        const isEnemy = !Dogeware_inst.isDefined(Dogeware_inst.me) || !Dogeware_inst.me.team || Dogeware_inst.me.team !== this.team;
                        return this.inView || (isEnemy && Dogeware_inst.state.nameTags);
                    },
                },
                canBSeen: {
                    set(val) {
                        this.inView2 = val;
                    },
                    get() {
                        return this.inView2 || Dogeware_inst.settings.botNametags;
                    },
                },
                events: {
                    set(val) {
                        this._events = val;
                        if (this.ahNum !== 0) {
                            return;
                        }
                        Dogeware_inst.wsSend = this.send.bind(this);
                        Dogeware_inst.wsEvent = this._dispatchEvent.bind(this);
                        Dogeware_inst.socket = this;
                        this.send = new Proxy(this.send, {
                            apply(_target, _that, [arg1, arg2]) {
                                if (arg1 === 'en') {
                                    Dogeware_inst.skins = {
                                        main: arg2[2][0],
                                        secondary: arg2[2][1],
                                        hat: arg2[3],
                                        body: arg2[4],
                                        knife: arg2[9],
                                        dye: arg2[14],
                                        waist: arg2[17],
                                    };
                                }
                                return Reflect.apply(...arguments);
                            },
                        });
                        this._dispatchEvent = new Proxy(this._dispatchEvent, {
                            apply(_target, _that, [arg1, arg2]) {
                                if (Dogeware_inst.settings.skinHack && arg1 === '0') {
                                    const skins = arg2[0];
                                    let increase = 38;

                                    while (skins.length % increase !== 0) {
                                        increase++;
                                    }

                                    for (let i = 0; i < skins.length; i += increase) {
                                        skins[i + 12] = [Dogeware_inst.skins.main, Dogeware_inst.skins.secondary];
                                        skins[i + 13] = Dogeware_inst.skins.hat;
                                        skins[i + 14] = Dogeware_inst.skins.body;
                                        skins[i + 19] = Dogeware_inst.skins.knife;
                                        skins[i + 24] = Dogeware_inst.skins.dye;
                                        skins[i + 33] = Dogeware_inst.skins.waist;
                                    }
                                }
                                return Reflect.apply(...arguments);
                            },
                        });
                    },
                    get() {
                        return this._events;
                    },
                },
                thirdPerson: {
                    set(val) {
                        this._thirdPerson = val;
                    },
                    get() {
                        return this._thirdPerson || Dogeware_inst.settings.thirdPerson;
                    },
                },
            });
        }

        createListeners() {
            this.loadSettings();
            this.waitFor(() => window.instructionsUpdate).then((elem) => {
                this.createObserver(elem, 'style', (mutated_elem) => {
                    if (location.host === 'krunker.io' && mutated_elem.textContent.includes('Connection Banned')) {
                        localStorage.removeItem('krunker_token');
                        alert("You Have Been Banned And Sign Out, You Will Now Be Redirected to Krunkers Proxy 'browserfps'");
                        location.assign('https://browserfps.com/');
                        return;
                    }
                    if (this.settings.autoServer && this.arrayTest(mutated_elem, ['Kicked', 'Banned', 'Disconnected', 'Error', 'Game is full'], (val) => mutated_elem.innerHTML.includes(val))) {
                        location = document.location.origin;
                    }
                });
            });

            this.waitFor(() => window.windows).then(() => {
                this.initGUI();
            });

            document.addEventListener('DOMContentLoaded', () => {
                this.customCSS();
                const rules = ['#aContainer, #aHolder, #endAContainer, #aMerger, #onetrust-consent-sdk { display: none !important; }', '#chatList * { user-select: text; }'];
                new Array(...document.styleSheets).forEach((stylesheet) => {
                    if (stylesheet.href) {
                        const css_regex = /http.*?krunker.io\/css\/(\w+.css).+/.exec(stylesheet.href);
                        if (css_regex?.[1]) {
                            const css_match = css_regex[1];
                            if (css_match?.includes('main_custom')) {
                                rules.forEach((rule, _index, _array) => {
                                    stylesheet.insertRule(rule);
                                });
                            }
                        }
                    }
                });
            });

            window.addEventListener('mouseup', (event) => {
                if (event.which === 2 && Dogeware_inst.settings.guiOnMMB) {
                    event.preventDefault();
                    Dogeware_inst.showGUI();
                }
            });
            window.addEventListener('keyup', (key) => {
                if (this.state.pressedKeys.has(key.code)) {
                    this.state.pressedKeys.delete(key.code);
                }
                if (!(document.activeElement.tagName === 'INPUT' || (!window.endUI && window.endUI.style.display)) && Dogeware_inst.settings.keybinds) {
                    switch (key.code) {
                    case 'KeyY':
                        this.state.bindAimbotOn = !this.state.bindAimbotOn;
                        if (this.wsEvent && typeof this.wsEvent === 'function') this.wsEvent('ch', [null, `Aimbot ${this.state.bindAimbotOn ? 'on' : 'off'}`, 1]);
                        break;
                    case 'KeyH':
                        this.settings.esp = (this.settings.esp + 1) % 4;
                        if (this.wsEvent && typeof this.wsEvent === 'function') this.wsEvent('ch', [null, `ESP: ${['disabled', 'nametags', 'box', 'full'][this.settings.esp]}`, 1]);
                        break;
                    }
                }
            });
            window.addEventListener('keydown', (key) => {
                if (key.code === 'F1') {
                    key.preventDefault();
                    Dogeware_inst.showGUI();
                }

                if (document.activeElement.tagName === 'INPUT' || (!window.endUI && window.endUI.style.display)) {
                    return;
                }

                if (key.code === 'NumpadSubtract') {
                    document.exitPointerLock();
                    _console.dirxml(this);
                } else if (!this.state.pressedKeys.has(key.code)) {
                    this.state.pressedKeys.add(key.code);
                }
            });
        }

        loadSettings() {
            let new_settings = {};
            try {
                new_settings = JSON.parse(window.localStorage.getItem('Dogeware'));
            } catch (err) {
                const cookiesArr = document.cookie.split(';');
                for (let cookie of cookiesArr) {
                    cookie = cookie.trim();
                    if (cookie.startsWith('Dogeware=')) {
                        new_settings = JSON.parse(decodeURIComponent(cookie.substring('Dogeware='.length, cookie.length)));
                        break;
                    }
                }
            }
            for (const setting in new_settings) {
                if (this.settings[setting] !== undefined) {
                    this.settings[setting] = new_settings[setting];
                }
            }
            this.saveSettings(true);
        }

        deleteSettings() {
            try {
                window.localStorage.removeItemonload('Dogeware');
                location.reload();
            } catch (err) {
            }
        }

        saveSettings(settingsPresent) {
            try {
                window.localStorage.setItem('Dogeware', JSON.stringify(this.settings));
            } catch (err) {
                const date = new Date();
                date.setTime(date.getTime() + 31_104_000_000);
                const expiry = `expires=${date.toGMTString()}`;
                document.cookie = `Dogeware=${encodeURIComponent(JSON.stringify(this.settings))}; ${expiry}`;
            }
            if (settingsPresent) {
                _console.log('[Dogeware] Settings loaded\uFF1A', this.settings);
            }
        }

        inputs(input) {
            const keyEnum = {
                frame: 0,
                delta: 1,
                xdir: 2,
                ydir: 3,
                moveDir: 4,
                shoot: 5,
                scope: 6,
                jump: 7,
                reload: 8,
                crouch: 9,
                weaponScroll: 10,
                weaponSwap: 11,
                moveLock: 12,
            };

            this.state.frame = input[keyEnum.frame];
            this.state.nameTags = [1, 2].some((arrElem) => arrElem === this.settings.esp) || this.settings.forceNametagsOn;

            if (this.me) {
                // Auto Nuke
                if (this.settings.autoNuke && Object.keys(this.me.streaks).length && (this.wsSend && typeof this.wsSend === 'function')) this.wsSend('k', 0);

                // Bhop
                if (this.settings.bhop && (this.state.pressedKeys.has('Space') || this.settings.bhop % 2)) {
                    this.controls.keys[this.controls.binds.jump.val] ^= 1;

                    if (this.controls.keys[this.controls.binds.jump.val]) {
                        this.controls.didPressed[this.controls.binds.jump.val] = 1;
                    }

                    if ((this.state.pressedKeys.has('Space') || this.settings.bhop === 3) && (this.me.velocity.y < -0.03 && this.me.canSlide)) {
                        setTimeout(() => {
                            this.controls.keys[this.controls.binds.crouch.val] = 0;
                        }, this.me.slideTimer || 325);

                        this.controls.keys[this.controls.binds.crouch.val] = 1;
                        this.controls.didPressed[this.controls.binds.crouch.val] = 1;
                    }
                }

                // nametags
                if (this.settings.forceNametagsOn) {
                    try {
                        Object.defineProperty(this.game.config, 'nameTags', {
                            get() {
                                if (Dogeware_inst.settings.forceNametagsOn) {
                                    return false;
                                }
                                return this.game._nametags;
                            },
                            set(val) {
                                this.game._nametags = val;
                            },
                        });
                    } catch (err) { /* empty */ }
                }

                // Spinbot
                if (this.settings.spinBot) {
                    const rate = 1;
                    if (input[keyEnum.moveDir] !== -1) {
                        input[keyEnum.moveDir] = (input[keyEnum.moveDir] + this.state.spinCounter - Math.round(7 * (input[keyEnum.ydir] / (Math.PI * 2000)))) % 7;
                    }
                    input[keyEnum.ydir] = (this.state.spinCounter / 7) * (Math.PI * 2000);
                    if (input[keyEnum.frame] % rate === 0) {
                        this.state.spinCounter = (this.state.spinCounter + 1) % 7;
                    }
                }

                // Auto reload
                if (this.settings.autoReload && this.me.ammos[this.me.weaponIndex] === 0) {
                    input[keyEnum.reload] = 1;
                }

                // Pitch hack (antiaim)
                if (this.settings.pitchHack) {
                    switch (this.settings.pitchHack) {
                    case 1:
                        input[keyEnum.xdir] = -Math.PI * 500;
                        break;
                    case 2:
                        input[keyEnum.xdir] = Math.PI * 500;
                        break;
                    case 3:
                        input[keyEnum.xdir] = Math.sin(Date.now() / 50) * Math.PI * 500;
                        break;
                    case 4:
                        input[keyEnum.xdir] = Math.sin(Date.now() / 250) * Math.PI * 500;
                        break;
                    case 5:
                        input[keyEnum.xdir] = input[keyEnum.frame] % 2 ? Math.PI * 500 : -Math.PI * 500;
                        break;
                    case 6:
                        input[keyEnum.xdir] = (Math.random() * Math.PI - Math.PI / 2) * 1000;
                        break;
                    }
                }

                // Aim noise
                const noise = () => (Math.random() * 2 - 1) * this.settings.aimNoise;

                this.game.players.list.forEach((player) => {
                    player.pos = {
                        x: player.x,
                        y: player.y,
                        z: player.z,
                    };
                    player.npos = {
                        x: player.x + noise(),
                        y: player.y + noise(),
                        z: player.z + noise(),
                    };
                    player.isTarget = false;
                });

                function meshValidate(mesh, targetMesh) {
                    if (mesh?.name === targetMesh) {
                        return mesh;
                    }

                    for (const child of child.children) {
                        const result = meshValidate(child, targetMesh);
                        if (result) {
                            return result;
                        }
                    }

                    return null;
                }

                if (this.game.AI.ais) {
                    this.game.AI.ais.map((ai_player) => {
                        if (ai_player.mesh) {
                            const result = meshValidate(ai_player.mesh, 'Head');
                            if (result) {
                                const worldPos = {
                                    ...result.getWorldPosition(),
                                };
                                worldPos.y -= 8;
                                return (ai_player.npos = ai_player.pos = worldPos);
                            }
                        }

                        ai_player.npos = ai_player.pos = {
                            x: ai_player.x,
                            y: ai_player.y,
                            z: ai_player.z,
                        };

                        return ai_player;
                    });
                }

                if (this.renderer?.frustum && this.me.active) {
                    this.controls.target = null;
                    const enemies = this.game.players.list
                        .filter((player) => !player.isYTMP && player.hasOwnProperty('npos') && (!this.settings.frustumCheck || this.containsPoint(player.npos)) && (this.me.team === null || player.team !== this.me.team) && player.health > 0 && player.inView)
                        .sort((player1, player2) => this.getDistance2D(this.me.x, this.me.z, player1.npos.x, player1.npos.z) - this.getDistance2D(this.me.x, this.me.z, player2.npos.x, player2.npos.z));

                    if (this.game.AI.ais && this.settings.AImbot) {
                        const ai_players = this.game.AI.ais
                            .filter((player) => player.mesh?.visible && player.health && player.pos && player.inView2 && player.team !== this.me.team)
                            .sort((player1, player2) => this.getDistance2D(this.me.x, this.me.z, player1.pos.x, player1.pos.z) - this.getDistance2D(this.me.x, this.me.z, player2.pos.x, player2.pos.z));
                        enemies.push(...ai_players);
                    }

                    let enemy = enemies[0];

                    // Check if enemy is within fov box
                    if (this.settings.fovbox) {
                        const scale = this.scale || parseFloat(RegExp(/\((.+)\)/).exec(document.getElementById('uiBase').style.transform)[1]);
                        const width = innerWidth / scale;
                        const height = innerHeight / scale;
                        let foundTarget = false;
                        for (const _tempEnemy of enemies) {
                            const screen = this.world2Screen(new this.three.Vector3(_tempEnemy.x, _tempEnemy.y, _tempEnemy.z), width, height, _tempEnemy.height / 2);
                            let fovBoxSize = [width / 3, height / 4, width * (1 / 3), height / 2];
                            switch (this.settings.fovBoxSize) {
                            case 2:
                                fovBoxSize = [width * 0.4, height / 3, width * 0.2, height / 3];
                                break;
                            case 3:
                                fovBoxSize = [width * 0.45, height * 0.4, width * 0.1, height * 0.2];
                                break;
                            }
                            if (screen.x >= fovBoxSize[0] && screen.x <= fovBoxSize[0] + fovBoxSize[2] && screen.y >= fovBoxSize[1] && screen.y < fovBoxSize[1] + fovBoxSize[3]) {
                                enemy = _tempEnemy;
                                foundTarget = true;
                                break;
                            }
                        }
                        if (!foundTarget) {
                            enemy = null;
                        }
                    }

                    const shootKey = input[keyEnum.shoot];
                    if (
                        enemy
                        && this.settings.aimbot
                        && this.state.bindAimbotOn
                        && (!this.settings.aimbotRange || this.getDistance3D(this.me.x, this.me.y, this.me.z, enemy.x, enemy.y, enemy.z) < this.settings.aimbotRange)
                        && (!this.settings.rangeCheck || this.getDistance3D(this.me.x, this.me.y, this.me.z, enemy.x, enemy.y, enemy.z) <= this.me.weapon.range)
                        && !this.me.reloadTimer
                    ) {
                        if (this.settings.awtv) {
                            input[keyEnum.scope] = 1;
                        }

                        enemy.isTarget = this.settings.markTarget;

                        const ydir = (this.getDirection2D(this.me.z, this.me.x, enemy.npos.z, enemy.npos.x) || 0) * 1000;
                        const xir = enemy.isAI
                            ? ((this.calcXRotation(this.me.x, this.me.y, this.me.z, enemy.npos.x, enemy.npos.y, enemy.npos.z) || 0) - 0.3 * this.me.recoilAnimY) * 1000
                            : ((this.calcXRotation(this.me.x, this.me.y, this.me.z, enemy.npos.x, enemy.npos.y - enemy.crouchVal * 3 + this.me.crouchVal * 3 + this.settings.aimOffset, enemy.npos.z) || 0) - 0.3 * this.me.recoilAnimY) * 1000;

                        if (this.settings.forceUnsilent) {
                            this.controls.target = {
                                xD: xir / 1000,
                                yD: ydir / 1000,
                            };
                            this.controls.update(400);
                        }

                        switch (this.settings.aimbot) {
                        case 1:
                        case 2:
                        case 5:
                        case 6:
                        case 9:
                        case 10:
                            {
                                const isOnAim = [5, 6, 9].some((arrElem) => arrElem === this.settings.aimbot);
                                if ((this.settings.aimbot === 5 && input[keyEnum.scope]) || this.settings.aimbot === 10) {
                                    _console.log('Aimbot is set to either unsilent on aim or unsilent');
                                    this.controls.target = {
                                        xD: xir / 1000,
                                        yD: ydir / 1000,
                                    };
                                    this.controls.update(400);
                                }

                                if (([2, 10].some((arrElem) => arrElem === this.settings.aimbot) || (this.settings.aimbot === 1 && this.me.weapon.id)) && !this.me.weapon.melee) {
                                    _console.log('Aimbot is set to silent, or unsilent, or quickscope / autopick');
                                    input[keyEnum.scope] = 1;
                                }

                                if (this.me.didShoot) {
                                    _console.log('Already shot');
                                    input[keyEnum.shoot] = 0;
                                    this.state.quickscopeCanShoot = false;
                                    setTimeout(() => {
                                        _console.log('Can shoot again');
                                        this.state.quickscopeCanShoot = true;
                                    }, this.me.weapon.rate * 0.85);
                                } else if (this.state.quickscopeCanShoot && (!isOnAim || input[keyEnum.scope])) {
                                    if (!this.me.weapon.melee) {
                                        input[keyEnum.scope] = 1;
                                    }

                                    if (!this.settings.superSilent && this.settings.aimbot !== 9) {
                                        _console.log('Aimbot isn\'t supersilent and it isnt aim correction');
                                        input[keyEnum.ydir] = ydir;
                                        input[keyEnum.xdir] = xir;
                                    }

                                    if ((this.settings.aimbot !== 9 && (!this.me.aimVal || this.me.weapon.noAim || this.me.weapon.melee)) || (this.settings.aimbot === 9 && shootKey)) {
                                        _console.log('Aimbot is not aim correction or it is aim correction and shoot key is pressed');
                                        input[keyEnum.ydir] = ydir;
                                        input[keyEnum.xdir] = xir;
                                        input[keyEnum.shoot] = 1;
                                    }
                                }
                            }
                            break;
                        case 4:
                        case 7:
                        case 8:
                        case 11:
                            if (input[keyEnum.scope] || this.settings.aimbot === 11) {
                                _console.log('Scoped and aimbot is set to easy aim assist');
                                this.controls.target = {
                                    xD: xir / 1000,
                                    yD: ydir / 1000,
                                };

                                this.controls.update(
                                    {
                                        4: 400,
                                        7: 110,
                                        8: 70,
                                        11: 400,
                                    }[this.settings.aimbot],
                                );

                                if ([4, 11].some((arrElem) => arrElem === this.settings.aimbot)) {
                                    _console.log('Aimbot is set to either aim assist or easy aim assist');
                                    input[keyEnum.xdir] = xir;
                                    input[keyEnum.ydir] = ydir;
                                }

                                if (this.me.didShoot) {
                                    _console.log('Already shot');
                                    input[keyEnum.shoot] = 0;
                                    this.state.quickscopeCanShoot = false;
                                    setTimeout(() => {
                                        _console.log('Can shoot again');
                                        this.state.quickscopeCanShoot = true;
                                    }, this.me.weapon.rate * 0.85);
                                } else if (this.state.quickscopeCanShoot) {
                                    _console.log('Can shoot');
                                    input[this.me.weapon.melee ? keyEnum.shoot : keyEnum.scope] = 1;
                                }
                            } else {
                                this.controls.target = null;
                            }
                            break;
                        case 12:
                            {
                                if (!this.three || !this.renderer || !this.renderer.camera || !this.game || !this.game.players || !this.game.players.list.length || !input[keyEnum.scope] || this.me.aimVal) {
                                    break;
                                }

                                _console.log('Triggerbot');

                                if (!this.state.raycaster) {
                                    this.state.raycaster = new this.three.Raycaster();
                                    this.state.mid = new this.three.Vector2(0, 0);
                                }

                                const enemies = [];
                                for (const player of this.game.players.list) {
                                    if (!player || !player.objInstances || player.isYTMP || !(this.me.team === null || player.team !== this.me.team) || !player.inView) {
                                        continue;
                                    }
                                    enemies.push(player.objInstances);
                                }

                                const { raycaster } = this.state;
                                raycaster.setFromCamera(this.state.mid, this.renderer.camera);
                                if (raycaster.intersectObjects(enemies, true).length) {
                                    input[keyEnum.shoot] = this.me.didShoot ? 0 : 1;
                                }
                            }
                            break;
                        }
                    } else {
                        if (this.settings.uwtv) {
                            input[keyEnum.scope] = 0;
                        }
                        this.state.spinFrame = 0;
                    }
                }
                if (this.settings.alwaysAim) {
                    input[keyEnum.scope] = 1;
                }
                if (this.settings.preventMeleeThrowing && this.me.weapon.melee) {
                    input[keyEnum.scope] = 0;
                }
            }
            return input;
        }

        render() {
            const scale = this.scale || parseFloat(RegExp(/\((.+)\)/).exec(document.getElementById('uiBase').style.transform)[1]);
            const width = innerWidth / scale;
            const height = innerHeight / scale;

            const line = (x1, y1, x2, y2, lineWidth, strokeStyle) => {
                this.ctx.save();
                this.ctx.lineWidth = lineWidth + 2;
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
                this.ctx.stroke();
                this.ctx.lineWidth = lineWidth;
                this.ctx.strokeStyle = strokeStyle;
                this.ctx.stroke();
                this.ctx.restore();
            };

            const rect = (x, y, ox, oy, w, h, color, fill) => {
                this.ctx.save();
                this.ctx.translate(~~x, ~~y);
                this.ctx.beginPath();

                if (fill) {
                    this.ctx.fillStyle = color;
                } else {
                    this.ctx.strokeStyle = color;
                }

                this.ctx.rect(ox, oy, w, h);

                if (fill) {
                    this.ctx.fill();
                } else {
                    this.ctx.stroke();
                }

                this.ctx.closePath();
                this.ctx.restore();
            };

            const getTextMeasurements = (arr) => {
                arr.forEach((value, index, array) => {
                    arr[index] = ~~this.ctx.measureText(value).width;
                });

                // for (let i = 0; i < arr.length; i++) {
                //     arr[i] = ~~this.ctx.measureText(arr[i]).width;
                // }

                return arr;
            };

            const gradient = (x, y, w, h, colors) => {
                const grad = this.ctx.createLinearGradient(x, y, w, h);
                for (let i = 0; i < colors.length; i++) {
                    grad.addColorStop(i, colors[i]);
                }
                return grad;
            };

            const text = (text, font, color, x, y) => {
                this.ctx.save();
                this.ctx.translate(~~x, ~~y);
                this.ctx.fillStyle = color;
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
                this.ctx.font = font;
                this.ctx.lineWidth = 1;
                this.ctx.strokeText(text, 0, 0);
                this.ctx.fillText(text, 0, 0);
                this.ctx.restore();
            };

            const fetchColor = (playerTeam, myTeam, colors = ['#FF4444', '#44AAFF']) => {
                const enemyColor = colors[0];
                const teamColor = colors[1];

                if (playerTeam === null || playerTeam !== myTeam) {
                    return enemyColor;
                }
                if (playerTeam === myTeam) {
                    return teamColor;
                }
            };

            const padding = 2;
            for (const player of this.game.players.list.filter(
                (player) => !player.isYTMP
                    && player.active
                    && !player.isYou
                    && (player.pos = {
                        x: player.x,
                        y: player.y,
                        z: player.z,
                    }),
            )) {
                const pos = new this.three.Vector3(player.pos.x, player.pos.y, player.pos.z);
                const screenR = this.world2Screen(pos.clone(), width, height);
                const screenH = this.world2Screen(pos.clone(), width, height, player.height);
                const heightDiff = ~~(screenR.y - screenH.y);
                const boxWidth = ~~(heightDiff * 0.6);
                const font = `${this.settings.espFontSize}px GameFont`;

                if (!this.containsPoint(player.pos)) {
                    continue;
                }

                // Tracers
                if (this.settings.tracers) {
                    line(width / 2, Dogeware_inst.settings.tracers == 2 ? height / 2 : height - 1, screenR.x, screenR.y, 2, fetchColor(player.team, this.me.team));
                }

                // Chams
                if (this.isDefined(player.objInstances)) {
                    if (player.objInstances.visible) {
                        if (Dogeware_inst.rainbow >= 360) {
                            Dogeware_inst.rainbow = 0;
                        } else {
                            Dogeware_inst.rainbow++;
                        }

                        player.objInstances.traverse((obj) => {
                            if (obj && obj.type === 'Mesh' && this.isDefined(obj.material)) {
                                if (!obj.hasOwnProperty(this.hash)) {
                                    obj[this.hash] = obj.material;
                                } else if (obj.hasOwnProperty(this.hash)) {
                                    Object.defineProperty(obj, 'material', {
                                        get() {
                                            if (!Dogeware_inst.settings.chams) {
                                                return this[Dogeware_inst.hash];
                                            }

                                            return new Dogeware_inst.three.MeshBasicMaterial({
                                                color: new Dogeware_inst.three.Color(Dogeware_inst.settings.chamsCol === 12 ? `hsl(${Dogeware_inst.rainbow},100%, 50%)` : Object.values(Dogeware_inst.colors)[Dogeware_inst.settings.chamsCol]),
                                                depthTest: false,
                                                transparent: true,
                                                fog: false,
                                                wireframe: Dogeware_inst.settings.wireframe,
                                            });
                                        },
                                    });
                                }
                            }
                        });
                    } else {
                        Object.defineProperty(player.objInstances, 'visible', {
                            value: true,
                            writable: false,
                        });
                    }
                }

                // If esp isnt set to nametags
                if (this.settings.esp > 1) {
                    // Target text
                    if (player.isTarget) {
                        this.ctx.save();
                        const measurement = getTextMeasurements(['TARGET']);
                        text('TARGET', font, '#FFFFFF', screenH.x - measurement[0] / 2, screenH.y - this.settings.espFontSize * 1.5);
                        this.ctx.beginPath();
                        this.ctx.translate(screenH.x, screenH.y + Math.abs(heightDiff / 2));
                        this.ctx.arc(0, 0, Math.abs(heightDiff / 2) + 10, 0, Math.PI * 2);
                        this.ctx.strokeStyle = '#FFFFFF';
                        this.ctx.stroke();
                        this.ctx.closePath();
                        this.ctx.restore();
                    }

                    if (this.settings.esp === 2) {
                        this.ctx.save();
                        this.ctx.strokeStyle = this.me.team === null || player.team !== this.me.team ? '#FF4444' : '#44AAFF';
                        this.ctx.strokeRect(screenH.x - boxWidth / 2, screenH.y, boxWidth, heightDiff);
                        this.ctx.restore();
                        continue;
                    }

                    // Healthbar
                    rect(screenH.x - boxWidth / 2 - 7, ~~screenH.y - 1, 0, 0, 4, heightDiff + 2, '#000000', false);
                    rect(screenH.x - boxWidth / 2 - 7, ~~screenH.y - 1, 0, 0, 4, heightDiff + 2, '#44FF44', true);
                    rect(screenH.x - boxWidth / 2 - 7, ~~screenH.y - 1, 0, 0, 4, ~~(((player.maxHealth - player.health) / player.maxHealth) * (heightDiff + 2)), '#000000', true);
                    this.ctx.save();

                    this.ctx.lineWidth = 4;
                    this.ctx.translate(~~(screenH.x - boxWidth / 2), ~~screenH.y);

                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, boxWidth, heightDiff);
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
                    this.ctx.stroke();

                    this.ctx.lineWidth = 2;
                    this.ctx.strokeStyle = fetchColor(player.team, this.me.team);
                    this.ctx.stroke();

                    this.ctx.closePath();
                    this.ctx.restore();

                    this.ctx.save();
                    this.ctx.font = font;

                    // to add new settings, when measurement[4] is used in the last parameter, multiply it accordingly. i.e item 1 is * 1, item 2 is * 2, item 3 is * 3, etc.
                    // Level (left side)
                    const playerDist = ~~(this.getDistance3D(this.me.x, this.me.y, this.me.z, player.pos.x, player.pos.y, player.pos.z) / 10);
                    const measurement = getTextMeasurements(['[', playerDist, 'm]', player.level, '©', player.name]);
                    this.ctx.restore();
                    const grad2 = gradient(0, 0, measurement[4] * 5, 0, ['rgba(0, 0, 0, 0.25)', 'rgba(0, 0, 0, 0)']);
                    if (player.level) {
                        const levelGradient = gradient(
                            0,
                            0,
                            measurement[4] * 2 + measurement[3] + padding * 3,
                            0,
                            ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.25)'],
                        );
                        rect(~~(screenH.x - boxWidth / 2) - 12 - measurement[4] * 2 - measurement[3] - padding * 3, ~~screenH.y - padding, 0, 0, measurement[4] * 2 + measurement[3] + padding * 3, measurement[4] + padding * 2, levelGradient, true);
                        text(`${player.level}`, font, '#FFFFFF', ~~(screenH.x - boxWidth / 2) - 16 - measurement[3], ~~screenH.y + measurement[4] * 1);
                    }
                    rect(~~(screenH.x + boxWidth / 2) + padding, ~~screenH.y - padding, 0, 0, measurement[4] * 5, measurement[4] * 4 + padding * 2, grad2, true);

                    // Player name
                    text(player.name, font, player.team === null ? '#FFCDB4' : this.me.team === player.team ? '#B4E6FF' : '#FFCDB4', screenH.x + boxWidth / 2 + 4, screenH.y + measurement[4] * 1);

                    // Clan tag
                    if (player.clan) text(`[${player.clan}]`, font, '#AAAAAA', screenH.x + boxWidth / 2 + 8 + measurement[5], screenH.y + measurement[4] * 1);

                    // Health
                    text(`${Math.round(player.health)} HP`, font, '#33FF33', screenH.x + boxWidth / 2 + 4, screenH.y + measurement[4] * 2);

                    // Weapon name
                    text(player.weapon.name, font, '#DDDDDD', screenH.x + boxWidth / 2 + 4, screenH.y + measurement[4] * 3);

                    // Distance
                    text('[', font, '#AAAAAA', screenH.x + boxWidth / 2 + 4, screenH.y + measurement[4] * 4);
                    text(`${playerDist}`, font, '#DDDDDD', screenH.x + boxWidth / 2 + 4 + measurement[0], screenH.y + measurement[4] * 4);
                    text('m]', font, '#AAAAAA', screenH.x + boxWidth / 2 + 4 + measurement[0] + measurement[1], screenH.y + measurement[4] * 4);
                }
            }

            if (!(this.settings.fovbox && this.settings.drawFovbox)) {
                return;
            }
            let fovBox = [width / 3, height / 4, width * (1 / 3), height / 2];
            switch (this.settings.fovBoxSize) {
            case 2:
                fovBox = [width * 0.4, height / 3, width * 0.2, height / 3];
                break;
            case 3:
                fovBox = [width * 0.45, height * 0.4, width * 0.1, height * 0.2];
                break;
            }
            this.ctx.save();
            this.ctx.strokeStyle = 'red';
            this.ctx.strokeRect(...fovBox);
            this.ctx.restore();
        }

        customCSS() {
            if (!this.isDefined(this.CSSres) && this.settings.kpalCSS) {
                this.CSSres.rel = 'stylesheet';
                this.CSSres.disabled = false;
                (document.head || document.getElementsByTagName('head')[0]).appendChild(this.CSSres);
            }
            if (this.settings.customCSS.startsWith('http') && this.settings.customCSS.endsWith('.css')) {
                this.CSSres.href = this.settings.customCSS;
            } else {
                this.CSSres = undefined;
            }
        }

        initGUI() {
            function createGUIElem(html, _idk, callback) {
                const menuItemContainer = document.querySelector('#menuItemContainer');
                const item = document.createElement('div');
                const icon = document.createElement('div');
                const title = document.createElement('div');
                item.className = 'menuItem';
                icon.className = 'menuItemIcon';
                title.className = 'menuItemTitle';
                title.innerHTML = html;
                icon.style.backgroundImage = 'url("https://krunkercentral.com/wp-content/uploads/2022/10/kc-logo-icon.png")';
                icon.style.width = '50px';
                icon.style.height = '50px';
                icon.style.backgroundSize = 'contain';
                item.append(icon, title);
                menuItemContainer.append(item);
                item.addEventListener('click', callback);
            }

            Dogeware_inst.GUI.setSetting = (setting, val) => {
                if (setting === 'customCSS') {
                    Dogeware_inst.settings.customCSS = val;
                    Dogeware_inst.customCSS();
                } else {
                    _console.log('SET ', setting, ' ', val);
                    Dogeware_inst.settings[setting] = val;
                }

                Dogeware_inst.saveSettings();
            };

            Dogeware_inst.GUI.settings = {
                aimbot: {
                    val: this.settings.aimbot,
                },
            };

            Dogeware_inst.GUI.windowObj = {
                header: 'CH33T',
                html: '',
                gen() {
                    return Dogeware_inst.getGuiHtml();
                },
            };

            window.windows = {
                ...window.windows,
                length: window.windows.length,
            };

            Object.setPrototypeOf(window.windows, Array.prototype);
            Dogeware_inst.GUI.windowIndex = window.windows.length + 1;
            Object.defineProperty(window.windows, window.windows.length, {
                value: Dogeware_inst.GUI.windowObj,
            });

            if (this.settings.showGuiButton) {
                createGUIElem('CH33TS', null, () => {
                    window.showWindow(Dogeware_inst.GUI.windowIndex);
                });
            }
        }

        showGUI() {
            if (document.pointerLockElement || document.mozPointerLockElement) {
                document.exitPointerLock();
            }
            window.showWindow(this.GUI.windowIndex);
        }

        getGuiHtml() {
            const builder = {
                checkbox: (name, settingName, description = '', needsRestart = false) => `<div class="settName" title="${description}">${name} ${needsRestart ? '<span style="color: #eb5656">*</span>' : ''}<label class="switch" style="margin-left:10px"><input type="checkbox" onclick='${this.hash}.GUI.setSetting("${settingName}", this.checked)' ${Dogeware_inst.settings[settingName] ? 'checked' : ''
                }><span class="slider"></span></label></div>`,
                select: (name, settingName, options, description = '', needsRestart = false) => {
                    let html = `<div class="settName" title="${description}">${name} ${needsRestart ? '<span style="color: #eb5656">*</span>' : ''}<select onchange='${this.hash}.GUI.setSetting("${settingName}", parseInt(this.value))' class="inputGrey2">`;
                    for (const option in options) {
                        if (options.hasOwnProperty(option)) {
                            html += `<option value="${options[option]}" ${Dogeware_inst.settings[settingName] === options[option] ? 'selected' : ''}>${option}</option>,`;
                        }
                    }
                    return `${html}</select></div>`;
                },
                slider: (name, settingName, min, max, step, description = '') => `<div class="settName" title="${description}">${name} <input type="number" class="sliderVal" id="slid_input_${settingName}" min="${min}" max="${max}" value="${Dogeware_inst.settings[settingName]}" onkeypress="${this.hash}.GUI.setSetting('${settingName}', parseFloat(this.value.replace(',', '.')));document.querySelector('#slid_input_${settingName}').value=this.value" style="margin-right:0;border-width:0"><div class="slidecontainer" style=""><input type="range" id="slid_${settingName}" min="${min}" max="${max}" step="${step}" value="${Dogeware_inst.settings[settingName]}" class="sliderM" oninput="${this.hash}.GUI.setSetting('${settingName}', parseFloat(this.value));document.querySelector('#slid_input_${settingName}').value=this.value"></div></div>`,

                input: (name, settingName, type, description, extra) => `<div class="settName" title="${description}">${name} <input type="${type}" name="${type}" id="slid_utilities_${settingName}"\n${type === 'color' ? 'style="float:right;margin-top:5px"' : `class="inputGrey2" placeholder="${extra}"`}\nvalue="${Dogeware_inst.settings[settingName]}" oninput="${this.hash
                }.GUI.setSetting('${settingName}', this.value)"/></div>`,

                label: (name, description) => `<br><span style='color: black; font-size: 20px; margin: 20px 0'>${name}</span> <span style='color: dimgrey; font-size: 15px'>${description || ''}</span><br>`,

                nobrlabel: (name, description) => `<span style='color: black; font-size: 20px; margin: 20px 0'>${name}</span> <span style='color: dimgrey; font-size: 15px'>${description || ''}</span><br>`,

                br: () => '<br>',

                style: (content) => `<style>${content}</style>`,
            };

            let html = '<div id="settHolder">\n<img src="https://krunkercentral.com/wp-content/uploads/2022/10/kc-banner-new.png" width="100%">\n';
            Object.keys(builder).forEach((elem) => {
                const elem_type = builder[elem];
                builder[elem] = function () {
                    html += elem_type.apply(this, arguments);
                    return '';
                };
            });

            const tabs = ['Weapon', 'Wallhack', 'Visual', 'Tweaks', 'Movement', 'Other'];
            builder.style('.cheatTabButton { color: black; background: #ddd; padding: 2px 7px; font-size: 15px; cursor: pointer; text-align: center; } .cheatTabActive { background: #bbb;}');
            this.GUI.changeTab = (elem) => {
                const elem_text = elem.innerText;
                document.getElementById(`cheat-tabbtn-${tabs[Dogeware_inst.state.activeTab]}`).classList.remove('cheatTabActive');
                document.getElementById(`cheat-tab-${tabs[Dogeware_inst.state.activeTab]}`).style.display = 'none';
                elem.classList.add('cheatTabActive');
                document.getElementById(`cheat-tab-${elem_text}`).style.display = 'block';
                Dogeware_inst.state.activeTab = tabs.indexOf(elem_text);
            };

            html += '<table style="width: 100%; margin-bottom: 30px"><tr>';

            for (const tab of tabs) {
                html += `<td id="cheat-tabbtn-${tab}" onclick="${this.hash}.GUI.changeTab(this)" class="cheatTabButton ${tabs[Dogeware_inst.state.activeTab] === tab ? 'cheatTabActive' : ''}">`;
                html += tab;
                html += '</td>';
            }

            html += '</table></tr>';

            function tab(category, callback) {
                html += `<div style="display: ${Dogeware_inst.state.activeTab === category ? 'block' : 'none'}" class="cheat-tab" id="cheat-tab-${tabs[category]}">`;
                callback();
                html += '</div>';
            }

            tab(0, () => {
                builder.select('Aimbot [Y]', 'aimbot', {
                    None: 0,
                    'Quickscope / Auto pick': 1,
                    'Silent aimbot': 2,
                    'Aim assist': 4,
                    'Unsilent on aim': 5,
                    'Silent on aim': 6,
                    Smooth: 7,
                    'Aim correction': 9,
                    Unsilent: 10,
                    'Easy aim assist': 11,
                    'SP Trigger bot': 12,
                });
                builder.select('Spin aimbot speed', 'spinAimFrames', {
                    1: 30,
                    2: 20,
                    3: 15,
                    4: 10,
                    5: 5,
                });
                builder.slider('Aim range', 'aimbotRange', 0, 1000, 10, 'Set above 0 to make the aimbot pick enemies only at the selected range');
                builder.slider('Aim offset', 'aimOffset', -4, 1, 0.1, 'The lower it is, the lower the aimbot will shoot (0 - head, -4 - body)');
                builder.slider('Aim noise', 'aimNoise', 0, 2, 0.005, 'The higher it is, the lower is the aimbot accuracy');
                builder.checkbox('Supersilent aim', 'superSilent', "Only works with quickscope and silent aim, makes it almost invisible that you're looking at somebody when you're shooting at him");
                builder.checkbox('Aim at bots', 'AImbot', 'Makes the aimbot shoot at NPCs');
                builder.checkbox('FOV check', 'frustumCheck', 'Makes you only shoot at enemies that are in your field of view. Prevents 180 flicks');
                builder.checkbox('FOV box', 'fovbox', 'Creates a box in which enemies can be targetted, enable with FOV check');
                builder.select('FOV box size', 'fovBoxSize', {
                    Big: 1,
                    Medium: 2,
                    Small: 3,
                });
                builder.checkbox('Wallbangs', 'wallbangs', 'Makes the aimbot shoot enemies behind walls');
                builder.checkbox('Aimbot range check', 'rangeCheck', 'Checks if the enemy is in range of your weapon before shooting it, disable for rocket launcher');
                builder.checkbox('Auto reload', 'autoReload', "Automatically reloads your weapon when it's out of ammo");
                builder.checkbox('Prevent melee throwing', 'preventMeleeThrowing', 'Prevents you from throwing your knife');
            });
            tab(1, () => {
                builder.select('ESP [H]', 'esp', {
                    None: 0,
                    Nametags: 1,
                    'Box ESP': 2,
                    'Full ESP': 3,
                });
                builder.select('ESP Font Size', 'espFontSize', {
                    '30px': 30,
                    '25px': 25,
                    '20px': 20,
                    '15px': 15,
                    '10px': 10,
                    '5px': 5,
                });
                builder.select(
                    'Tracers',
                    'tracers',
                    {
                        None: 0,
                        Bottom: 1,
                        Middle: 2,
                    },
                    'Draws lines to players',
                );
                builder.checkbox('Bot nametags', 'botNametags', 'Always show nametags for bots such as zombies.');
                builder.checkbox('Mark aimbot target', 'markTarget', 'Shows who is the aimbot targetting at the time, useful for aim assist/aim correction');
                builder.checkbox('Draw FOV box', 'drawFovbox', 'Draws the FOV box from aimbot settings');
                builder.checkbox('Chams', 'chams');
                builder.select('Chams colour', 'chamsCol', {
                    White: 0,
                    Black: 1,
                    Purple: 2,
                    Pink: 3,
                    Blue: 4,
                    DarkBlue: 5,
                    Aqua: 6,
                    Green: 7,
                    Lime: 8,
                    Orange: 9,
                    Yellow: 10,
                    Red: 11,
                    rainbow: 12,
                });
                builder.checkbox('Friendly chams', 'teamChams', 'Show Chams for friendly players');
                builder.checkbox('Wireframe', 'wireframe');
                builder.slider('RGB interval', 'chamsInterval', 50, 1000, 50, 'How fast will the RGB chams change colour');
            });
            tab(2, () => {
                builder.checkbox('Third person mode', 'thirdPerson');
                builder.checkbox('Skin hack', 'skinHack', 'Makes you able to use any skin in game, only shows on your side');
                builder.checkbox('Billboard shaders', 'animatedBillboards', 'Disable if you get fps drops');
                builder.checkbox('Any weapon trail', 'alwaysTrail');
                builder.slider('Weapon Zoom', 'weaponZoom', 0, 20, 0.1, 'Weapon Zoom Multiplier Adjust');
            });
            tab(3, () => {
                builder.checkbox('Always aim', 'alwaysAim', 'Makes you slower and jump lower, but the aimbot can start shooting at enemies  faster. Only use if ur good at bhopping');
                builder.checkbox('Aim when target visible', 'awtv');
                builder.checkbox('Unaim when no target visible', 'uwtv');
                builder.checkbox('Force unsilent', 'forceUnsilent');
            });
            tab(4, () => {
                builder.select('Auto bhop', 'bhop', {
                    None: 0,
                    'Auto Jump': 1,
                    'Key Jump': 2,
                    'Auto Slide': 3,
                    'Key Slide': 4,
                });
                builder.label('Only use with silent aim');
                builder.select(
                    'Pitch hax',
                    'pitchHack',
                    {
                        Disabled: 0,
                        Downward: 1,
                        Upward: 2,
                        'sin(time)': 3,
                        'sin(time/5)': 4,
                        double: 5,
                        random: 6,
                    },
                    'Only use with aimbot on',
                );
                builder.checkbox('Spin bot', 'spinBot');
            });
            tab(5, () => {
                builder.checkbox('Show GUI button', 'showGuiButton', "Disable if you don't want the dog under settings to be visible");
                builder.checkbox('GUI on middle mouse button', 'guiOnMMB', 'Makes it possible to open this menu by clicking the mouse wheel');
                builder.checkbox('Keybinds', 'keybinds', 'Turn keybinds on/off, Aimbot - Y, ESP - H');
                builder.checkbox('No inactivity kick', 'antikick', "Disables the 'Kicked for inactivity' message (client side, but works)");
                builder.checkbox('Auto nuke', 'autoNuke', 'Automatically nukes when you are able to');
                builder.checkbox('Force nametags on', 'fgno', 'Use in custom games with disabled nametags');
                builder.input('Custom CSS', 'customCSS', 'url', '', 'URL to CSS file');
            });
            html += '</div>';
            return html;
        }

        /* <-- Visual --> */
        // Calculate the distance between two 2D points
        getDistance2D(x1, y1, x2, y2) {
            // return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);

            const deltaX = x2 - x1;
            const deltaY = y2 - y1;
            return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }

        // Calculate the direction between two 2D points
        getDirection2D(x1, y1, x2, y2) {
            return Math.atan2(y1 - y2, x1 - x2);
        }

        // Calculate the distance between two 3D points
        getDistance3D(x1, y1, z1, x2, y2, z2) {
            const deltaX = x1 - x2;
            const deltaY = y1 - y2;
            const deltaZ = z1 - z2;
            return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        }

        // Calculate the x rotation between two 3D points
        calcXRotation(x1, y1, z1, x2, y2, z2) {
            const height = Math.abs(y1 - y2);
            const distance = this.getDistance3D(x1, y1, z1, x2, y2, z2);
            return Math.asin(height / distance) * (y1 > y2 ? -1 : 1);
        }

        // Calculate the distance between two angles
        getAngleDist(angle1, angle2) {
            return Math.atan2(Math.sin(angle2 - angle1), Math.cos(angle1 - angle2));
        }

        // Check if a point is within the view frustum
        containsPoint(point) {
            const { planes } = this.renderer.frustum;
            for (let i = 0; i < 6; i++) {
                if (planes[i].distanceToPoint(point) < 0) {
                    return false;
                }
            }
            return true;
        }

        // Converts a 3D world position to a 2D screen position
        world2Screen(pos, width, height, yOffset = 0) {
            pos.y += yOffset;
            pos.project(this.renderer.camera);
            pos.x = (pos.x + 1) / 2;
            pos.y = (-pos.y + 1) / 2;
            pos.x *= width;
            pos.y *= height;
            return pos;
        }

        /* <-- Utility --> */
        isType(item, type) {
            return typeof item === type;
        }

        isDefined(obj) {
            return !this.isType(obj, 'undefined') && obj !== null;
        }

        arrayTest(_obj, arr, fn) {
            return arr.some((arrElem) => fn(arrElem));
        }

        createElement(elementType, html, id) {
            const elem = document.createElement(elementType);

            if (id) {
                elem.id = id;
            }

            elem.innerHTML = html;
            return elem;
        }

        createObserver(elem, check, callback, onShow = true) {
            return new MutationObserver((mutationsList, _observer) => {
                if (check === 'src' || (onShow && mutationsList[0].target.style.display === 'block') || !onShow) {
                    callback(mutationsList[0].target);
                }
            }).observe(
                elem,
                check === 'childList'
                    ? {
                        childList: true,
                    }
                    : {
                        attributes: true,
                        attributeFilter: [check],
                    },
            );
        }

        genHash(length) {
            return [...Array(length)].map((_elem) => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[~~(Math.random() * 52)]).join('');
        }

        async store(type) {
            const name = 'Dogeware';
            switch (type) {
            case 'get':
                return GM.getValue(name).then((value) => (this.isDefined(value) ? JSON.parse(value) : this.settings));
            case 'set':
                return GM.setValue(name, JSON.stringify(this.settings));
            case 'reset':
                return GM.deleteValue(name);
            }
        }

        async waitFor(test, timeout_ms = Infinity, doWhile = null) {
            const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            return new Promise(async (resolve, reject) => {
                if (typeof timeout_ms !== 'number') {
                    reject('Timeout argument not a number in waitFor(selector, timeout_ms)');
                }
                let result;
                const change = 100;
                while (result === undefined || result === false || result === null || result.length === 0) {
                    if (doWhile && doWhile instanceof Function) {
                        doWhile();
                    }

                    if (timeout_ms % 10_000 < change) {
                        _console.log('waiting for: ', test);
                    }
                    if ((timeout_ms -= change) < 0) {
                        _console.log('Timeout : ', test);
                        resolve(false);
                        return;
                    }
                    await sleep(change);
                    result = typeof test === 'string' ? Function(test)() : test();
                }
                _console.log('Passed : ', test);
                resolve(result);
            });
        }
    }

    const Dogeware_inst = new DogeWare();
    window.Doge = Dogeware_inst;
}

let tokenPromiseResolve;
const tokenPromise = new Promise((resolve) => (tokenPromiseResolve = resolve));

const ifr = document.createElement('iframe');
ifr.src = location.href;
ifr.style.display = 'none';
document.documentElement.append(ifr);
const ifrFetch = ifr.contentWindow.fetch;
Object.defineProperty(ifr.contentWindow, 'fetch', {
    get() {
        if (ifr.contentWindow?.windows?.length > 0) {
            return function (url) {
                if (typeof url === 'string' && url.includes('/seek-game')) {
                    ifr.remove();
                    tokenPromiseResolve(url);
                    return;
                }
                return ifrFetch.apply(this, arguments);
            };
        }
        return ifrFetch;
    },
});

const _fetch = window.fetch;
window.fetch = async function (url, _args) {
    if (typeof url === 'string' && url.includes('/seek-game')) {
        url = await tokenPromise;
    }
    return _fetch.apply(this, arguments);
};

function downloadFileSync(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send();
    if (request.status === 200) {
        return request.response;
    }
}

const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
        if (mutation.addedNodes) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.innerHTML.includes('@license Krunker.io')) {
                    node.remove();
                    const script = downloadFileSync(`${serverUrl}/game_1_4.js`);
                    Function(`${id}();\n\n${script}`)();
                }
            }
        }
    });
});

observer.observe(document, {
    childList: true,
    subtree: true,
});
