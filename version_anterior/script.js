document.addEventListener('DOMContentLoaded', function() {
    const soapForm = document.getElementById('soapForm');
    const baggageContainer = document.getElementById('baggageContainer');
    const addBaggageBtn = document.getElementById('addBaggageBtn');
    const removeBaggageBtn = document.getElementById('removeBaggageBtn');
    const responseOutput = document.getElementById('responseOutput');
    
    let baggageCount = 1; // Start at 1 because we already have one baggage item
    
    // Add new baggage item
    addBaggageBtn.addEventListener('click', function() {
        const newBaggageItem = document.createElement('div');
        newBaggageItem.className = 'baggage-item';
        newBaggageItem.innerHTML = `
            <div class="form-group">
                <label for="idEquipaje${baggageCount}">Baggage ID:</label>
                <input type="number" id="idEquipaje${baggageCount}" name="idEquipaje" value="${baggageCount}">
            </div>
            
            <div class="form-group">
                <label for="peso${baggageCount}">Weight:</label>
                <input type="number" id="peso${baggageCount}" name="peso" value="45">
            </div>
            
            <div class="form-group">
                <label for="dimensiones${baggageCount}">Dimensions:</label>
                <input type="number" id="dimensiones${baggageCount}" name="dimensiones" value="5">
            </div>
            
            <div class="form-group">
                <label for="manejoEspecial${baggageCount}">Special Handling:</label>
                <select id="manejoEspecial${baggageCount}" name="manejoEspecial">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="notasManejoEspecial${baggageCount}">Special Handling Notes:</label>
                <textarea id="notasManejoEspecial${baggageCount}" name="notasManejoEspecial"></textarea>
            </div>
        `;
        
        baggageContainer.appendChild(newBaggageItem);
        baggageCount++;
    });
    
    // Remove last baggage item
    removeBaggageBtn.addEventListener('click', function() {
        const baggageItems = baggageContainer.querySelectorAll('.baggage-item');
        if (baggageItems.length > 1) {
            baggageContainer.removeChild(baggageItems[baggageItems.length - 1]);
            baggageCount--;
        } else {
            alert('You need at least one baggage item.');
        }
    });
    
    // Handle form submission
    soapForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const soapUrl = document.getElementById('soapUrl').value;
        const documentID = document.getElementById('documentID').value || '?';
        const numReserva = document.getElementById('numReserva').value;
        const idCheckin = document.getElementById('idCheckin').value;
        
        // Get all baggage items
        const baggageItems = baggageContainer.querySelectorAll('.baggage-item');
        let baggageXml = '';
        
        baggageItems.forEach((item, index) => {
            const idEquipaje = document.getElementById(`idEquipaje${index}`).value;
            const peso = document.getElementById(`peso${index}`).value;
            const dimensiones = document.getElementById(`dimensiones${index}`).value;
            const manejoEspecial = document.getElementById(`manejoEspecial${index}`).value;
            const notasManejoEspecial = document.getElementById(`notasManejoEspecial${index}`).value || '?';
            
            baggageXml += `
                <InformacionEquipaje>
                   <idEquipaje>${idEquipaje}</idEquipaje>
                   <peso>${peso}</peso>
                   <dimensiones>${dimensiones}</dimensiones>
                   <manejoEspecial>${manejoEspecial}</manejoEspecial>
                   <notasManejoEspecial>${notasManejoEspecial}</notasManejoEspecial>
                </InformacionEquipaje>
            `;
        });
        
        // Construct SOAP envelope
        const soapEnvelope = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bag="http://www.example.org/baggage/">
               <soapenv:Header/>
               <soapenv:Body>
                  <bag:initBaggageRegistration>
                     <documentID>${documentID}</documentID>
                     <numReserva>${numReserva}</numReserva>
                     <idCheckin>${idCheckin}</idCheckin>
                     <informacionEquipaje>
                        ${baggageXml}
                     </informacionEquipaje>
                  </bag:initBaggageRegistration>
               </soapenv:Body>
            </soapenv:Envelope>
        `;
        
        // Send SOAP request
        sendSoapRequest(soapUrl, soapEnvelope);
    });
    
    // Function to send SOAP request
    function sendSoapRequest(url, soapEnvelope) {
        responseOutput.textContent = 'Sending request...';
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'SOAPAction': ''
            },
            body: soapEnvelope
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // Display the response
            responseOutput.textContent = data;
        })
        .catch(error => {
            // Handle errors
            responseOutput.textContent = `Error: ${error.message}\n\nRequest was:\n${soapEnvelope}`;
            
            // Add a note about CORS if that might be the issue
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                responseOutput.textContent += '\n\nNote: This might be a CORS issue. For security reasons, browsers block cross-origin requests. Try:'+
                '\n1. Using a CORS proxy'+
                '\n2. Testing with a browser extension that disables CORS'+
                '\n3. Configuring the SOAP server to allow CORS';
            }
        });
    }
}); 