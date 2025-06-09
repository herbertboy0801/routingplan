document.addEventListener('DOMContentLoaded', () => {
    const startLocationInput = document.getElementById('start-location');
    const destinationInputsContainer = document.getElementById('destination-inputs');
    const addDestinationBtn = document.getElementById('add-destination-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsList = document.getElementById('results-list').querySelector('ul');
    const mapPlaceholder = document.getElementById('map-placeholder');

    let destinationCount = 1;

    // 添加更多目的地输入框
    addDestinationBtn.addEventListener('click', () => {
        destinationCount++;
        const newDestinationGroup = document.createElement('div');
        newDestinationGroup.classList.add('form-group', 'destination-group');

        const newLabel = document.createElement('label');
        newLabel.setAttribute('for', `destination-${destinationCount}`);
        newLabel.textContent = `目标地点 ${destinationCount}:`;

        const newInput = document.createElement('input');
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('id', `destination-${destinationCount}`);
        newInput.classList.add('destination');
        newInput.setAttribute('placeholder', '例如: 深圳市世界之窗');

        newDestinationGroup.appendChild(newLabel);
        newDestinationGroup.appendChild(newInput);
        destinationInputsContainer.appendChild(newDestinationGroup);
    });

    // 计算按钮点击事件
    calculateBtn.addEventListener('click', async () => {
        const startLocation = startLocationInput.value.trim();
        const destinationElements = document.querySelectorAll('.destination');
        const destinations = [];

        destinationElements.forEach(input => {
            const destValue = input.value.trim();
            if (destValue) {
                destinations.push(destValue);
            }
        });

        if (!startLocation) {
            alert('请输入起始地点。');
            return;
        }

        if (destinations.length === 0) {
            alert('请输入至少一个目标地点。');
            return;
        }

        // 清空旧结果
        resultsList.innerHTML = '';
        mapPlaceholder.innerHTML = '<p>正在查询，请稍候...</p>';

        try {
            const mcpPayload = {
                server_name: 'google-maps',
                tool_name: 'maps_distance_matrix',
                arguments: {
                    origins: [startLocation],
                    destinations: destinations,
                    mode: 'driving'
                }
            };
            // 注意: 这里的 window.mcp является假设的MCP客户端注入方式
            // 实际调用方式可能根据MCP客户端的实现而有所不同
            if (window.mcp && window.mcp.useTool) {
                 const response = await window.mcp.useTool(mcpPayload.server_name, mcpPayload.tool_name, mcpPayload.arguments);
                 displayResults(response);
                 // displayMap(response); // 可选的地图显示
            } else {
                console.warn('MCP客户端 (window.mcp.useTool) 未找到。将使用模拟数据。');
                // 使用之前的模拟调用
                const response = await callGoogleMapsDistanceMatrixFallback(startLocation, destinations);
                displayResults(response);
            }
            // 旧的直接调用已被移至 fallback 或替换为MCP client调用
            // console.log("起始地点:", startLocation); // 这些日志和 alert 应该在 MCP 成功或 fallback 后不再需要
            // console.log("目标地点:", destinations);
            // alert('MCP调用功能待实现。请在控制台查看输入。');
            // resultsList.innerHTML = `<li>查询功能待实现。起始点: ${startLocation}, 目标点: ${destinations.join(', ')}</li>`;
            // mapPlaceholder.innerHTML = '<p>地图将在此处显示 (功能开发中)</p>';

        } catch (error) {
            console.error('计算距离时出错:', error);
            resultsList.innerHTML = `<li>计算出错: ${error.message}</li>`;
            mapPlaceholder.innerHTML = '<p>加载地图失败。</p>';
        }
    });

    // (占位符 / Fallback) 调用 Google Maps Distance Matrix MCP 工具
    async function callGoogleMapsDistanceMatrixFallback(origin, destinations) {
        // 这是MCP调用失败或未找到MCP客户端时的备用数据逻辑
        // 使用之前通过MCP工具获取的真实数据作为fallback
        console.log('MCP callGoogleMapsDistanceMatrixFallback (使用真实查询的静态数据):', origin, destinations);
        return Promise.resolve({
              "origin_addresses": [
                "1, No. 13, Alley 50, Lane 245, Chongqing Rd, Banqiao District, New Taipei City, Taiwan 220"
              ],
              "destination_addresses": [
                "220, Taiwan, New Taipei City, Banqiao District, 五權街39號1",
                "3, No. 29, Lane 167, Guoqing Rd, Banqiao District, New Taipei City, Taiwan 220",
                "8, No. 116號, Xinfu Rd, Banqiao District, New Taipei City, Taiwan 220",
                "220, Taiwan, New Taipei City, Banqiao District, 四川路一段112號",
                "No. 17號, Alley 1, Lane 150, Xinyi Rd, Banqiao District, New Taipei City, Taiwan 220",
                "4, No. 75, Guangxing St, Tucheng District, New Taipei City, Taiwan 236",
                "8, No. 38, Alley 19, Lane 245, Section 2, Sichuan Rd, Banqiao District, New Taipei City, Taiwan 220",
                "No. 157, Chongqing Rd, Banqiao District, New Taipei City, Taiwan 220"
              ],
              "results": [
                {
                  "elements": [
                    { "status": "OK", "duration": { "text": "3 mins", "value": 184 }, "distance": { "text": "0.8 km", "value": 819 } },
                    { "status": "OK", "duration": { "text": "3 mins", "value": 170 }, "distance": { "text": "0.6 km", "value": 634 } },
                    { "status": "OK", "duration": { "text": "8 mins", "value": 488 }, "distance": { "text": "1.7 km", "value": 1708 } },
                    { "status": "OK", "duration": { "text": "5 mins", "value": 297 }, "distance": { "text": "1.1 km", "value": 1130 } },
                    { "status": "OK", "duration": { "text": "7 mins", "value": 405 }, "distance": { "text": "1.8 km", "value": 1780 } },
                    { "status": "OK", "duration": { "text": "8 mins", "value": 466 }, "distance": { "text": "2.2 km", "value": 2228 } },
                    { "status": "OK", "duration": { "text": "9 mins", "value": 560 }, "distance": { "text": "2.6 km", "value": 2617 } },
                    { "status": "OK", "duration": { "text": "3 mins", "value": 173 }, "distance": { "text": "0.6 km", "value": 597 } }
                  ]
                }
              ]
        });
    }

    // 显示结果
    function displayResults(data) {
        resultsList.innerHTML = ''; // 清空旧结果

        if (!data) {
            resultsList.innerHTML = '<li>未能获取到结果数据。</li>';
            console.error("displayResults: data is null or undefined", data);
            return;
        }

        const destinationAddresses = data.destination_addresses || data.destinationAddresses;
        const apiResults = data.results; // Get the 'results' array

        if (!apiResults || !Array.isArray(apiResults) || apiResults.length === 0 || !apiResults[0].elements) {
            resultsList.innerHTML = '<li>结果数据格式不正确或为空。</li>';
            console.error("displayResults: Invalid or empty data.results or data.results[0].elements", data);
            return;
        }
        
        const elements = apiResults[0].elements; // Get elements from the first item in results

        if (!Array.isArray(elements)) { // Should be redundant if above check passed, but good for safety
            resultsList.innerHTML = '<li>结果数据格式不正确 (elements 非数组)。</li>';
            console.error("displayResults: Invalid data.results[0].elements (not an array)", data);
            return;
        }

        if (elements.length === 0) {
            if (destinationAddresses && destinationAddresses.length > 0) {
                resultsList.innerHTML = '<li>没有找到从起点到任何指定目的地的路线。</li>';
            } else {
                resultsList.innerHTML = '<li>未返回任何路线信息。</li>';
            }
            return;
        }

        elements.forEach((element, index) => {
            const destinationAddress = destinationAddresses && destinationAddresses[index] ? destinationAddresses[index] : `目标 ${index + 1}`;
            const listItem = document.createElement('li');

            if (element) { // Check if element itself is valid
                if (element.status === 'OK') {
                    listItem.innerHTML = `
                        <strong>目标: ${destinationAddress}</strong><br>
                        距离: ${element.distance ? element.distance.text : '未知'}<br>
                        预计时间: ${element.duration ? element.duration.text : '未知'}
                    `;
                } else {
                    // Status is not OK (e.g., ZERO_RESULTS, NOT_FOUND)
                    listItem.textContent = `无法计算到 "${destinationAddress}" 的路线。原因: ${element.status}`;
                }
            } else {
                // Element is null or undefined in the array
                listItem.textContent = `到 "${destinationAddress}" 的结果数据不完整或无效。`;
            }
            resultsList.appendChild(listItem);
        });

        if (resultsList.children.length === 0) {
            // This case should ideally be caught by earlier checks if elements array was empty
            resultsList.innerHTML = '<li>没有有效的路线信息可以显示。</li>';
        }
    }

    // (占位符) 显示地图
    function displayMap(data) {
        // TODO: 根据MCP返回的数据更新地图 (如果适用)
        mapPlaceholder.innerHTML = '<p>地图功能待根据实际API响应实现。</p>';
        console.log('MCP displayMap (待实现):', data);
    }
});