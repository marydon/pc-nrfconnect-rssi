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
// import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import Axis from './Axis';
import Spectrogram from './Spectrogram';

export default class LabelledSpectrogram extends React.Component {
    constructor(props) {
        super(props);
        this.scaleX = scaleLinear();
        this.scaleY = scaleLinear();
        this.state = {
            windowHeight: 500,
            windowWidth: 500,
        };
        this.boundHandleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.boundHandleResize );
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.boundHandleResize );
    }

    handleResize() {
        this.setState({
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
        });
    }

    render() {
        const spectrogramWidth = this.state.windowWidth - 345;
        const spectrogramHeight = this.state.windowHeight - 290;

        this.scaleX.domain([-15, 0]).range([0, spectrogramWidth]);
        this.scaleY.domain([2400, 2480]).range([0, spectrogramHeight]);

        return (
            <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                <div style={{ position: 'relative', width: `${spectrogramWidth + 1}px`, height: `${spectrogramHeight + 1}px` }}>
                    <Spectrogram {...this.props} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                </div>

                <svg style={{ position: 'absolute', top: 0, bottom: '3em', right: '52px', width: '80px', overflow: 'visible', zIndex: 10, height: spectrogramHeight }} >
                    <Axis
                        orientation="right"
                        scale={this.scaleY}
                        label="Frequency (MHz)"
                        height={spectrogramHeight}
                    />
                </svg>
                <svg style={{ position: 'absolute', bottom: '11px', right: '80px', left: '0', height: '80px', overflow: 'visible', zIndex: 10, width: `${spectrogramWidth}px` }} ><Axis
                    orientation="bottom"
                    scale={this.scaleX}
                    label="Time (sec)"
                    width={spectrogramWidth}
                />
                </svg>
            </div>
        );
    }

}


// LabelledSpectrogram.propTypes = {
//     rssi: PropTypes.arrayOf(Number),
//     rssiMax: PropTypes.arrayOf(Number),
//     animationDuration: PropTypes.number,
//     yMin: PropTypes.number,
//     yMax: PropTypes.number,
//     separateFrequencies: PropTypes.bool,
// };

// LabelledSpectrogram.defaultProps = {
//     rssi: [],
//     rssiMax: [],
//     animationDuration: 500,
//     yMin: -110,
//     yMax: -20,
//     separateFrequencies: false,
// };

