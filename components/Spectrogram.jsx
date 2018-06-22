/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react';
import PropTypes from 'prop-types';


export default class Spectrogram extends React.Component {
    constructor(props) {
        super(props);

        this.dataWidth = 300;
        this.dataHeight = 81;
    }

    componentDidMount() {
        // Trigger one column render every 100msec
        this.interval = setInterval(this.drawLine.bind(this), 50);

//         console.log('Canvas update started.');
    }

    componentWillUnmount() {
        // Stop updating the spectrogram
        clearInterval(this.interval);

//         console.log('Canvas update stopped.');
    }

    setCanvasRef(canvas) {
        if (!canvas) { return; }

        // / Initialize canvas.
        // / Pixels in the canvas will act as the state of the component.

        // Height is equal to the number of channels (frequency ranges) to
        // display. This is the amount of pixels addressable inside the canvas,
        // not the visible size of the canvas (which will be larger due to CSS)
        canvas.height = this.dataHeight;    /* eslint no-param-reassign: 0 */

        // Width is equal to the amount of data points to keep in time.
        // Same as the height, it's not the visible size of the canvas.
        canvas.width = this.dataWidth;      /* eslint no-param-reassign: 0 */

        this.ctx = canvas.getContext('2d');

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.dataWidth, this.dataHeight);


        if (this.canvas) {
            // If a previous canvas already exists, copy pixels over.
            this.ctx.drawImage(this.canvas,
                                0, 0,
                                this.dataWidth - 1, this.dataHeight,
                                0, 0,
                                this.dataWidth - 1, this.dataHeight);
        }

        // Store the reference to the canvas itself
        this.canvas = canvas;
    }

    drawLine() {
        if (this.canvas && this.props.rssi) {
            this.ctx.putImageData(
                this.ctx.getImageData(1, 0, this.dataWidth - 1, this.dataHeight),
                0, 0,
            );

            const min = this.props.yMin;
            const max = this.props.yMax;
//             const max = -70, min = -117;

            // Draw one pixel per value of the "rssi" prop in the rigthmost column
            for (let i = 0; i < this.dataHeight; i += 1) {
                // The value received from the firmware is just the value of the
                // RADIO.RSSISAMPLE hardware register - a positive 7-bit integer,
                // representing the signal strenght in *negative* dBm.
                // This is mapped into a negative number by the yRange.map()
                // function in the main module.

                const value = this.props.rssi[i];

                // Normalize into the 0-1 range
                const lightness = (value - min) / (max - min);

                // Square it, so that high values seem higher
//                 lightness **= 2;


//                 const historicMaxValue = this.props.rssi[i];

                // Normalize into the 0-1 range
//                 const historicMaxLightness = (historicMaxValue - min) / (max - min);

                this.ctx.fillStyle = `hsl(0, 0%, ${lightness * 100}%)`;
//                 this.ctx.fillStyle = 'hsl(0, histo%, ' + lightness * 100 + '%)';
//                 this.ctx.fillStyle = 'hsl(0, ' + lightness * 100 + '%, ' +
//                   historicMaxLightness * 100 +'%)';
//                 this.ctx.fillStyle = 'hsl(0, ' + (historicMaxLightness) * 30 +
//                 '%, ' + lightness * 100 +'%)';
                this.ctx.fillRect(this.dataWidth - 1, i, 1, 1);
            }
        }
    }

    render() {
        if (!this.rendered) {
            this.rendered = (<canvas
                ref={this.setCanvasRef.bind(this)}
                style={this.props.style}
            />);
        }

        return this.rendered;
    }
}


Spectrogram.propTypes = {
    rssi: PropTypes.arrayOf(Number),
//     rssiMax: PropTypes.arrayOf(Number),
//     animationDuration: PropTypes.number,
    yMin: PropTypes.number,
    yMax: PropTypes.number,
//     separateFrequencies: PropTypes.bool,
    style: PropTypes.shape({}),
};

Spectrogram.defaultProps = {
    rssi: [],
//     rssiMax: [],
//     animationDuration: 500,
    yMin: -100,
    yMax: -50,
//     separateFrequencies: false,
    style: {},
};

