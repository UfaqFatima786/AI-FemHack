// app.js

// === Lost & Found Logic ===
const lostFoundForm = document.getElementById('lost-found-form');
const itemsList = document.getElementById('items-list');

if (lostFoundForm && itemsList) {
    // Post Item
    lostFoundForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('item-type').value;
        const title = document.getElementById('item-title').value;
        const desc = document.getElementById('item-desc').value;
        const image = document.getElementById('item-image').value;
        const user = auth.currentUser;

        if (user) {
            db.collection('lost_found_items').add({
                type: type,
                title: title,
                description: desc,
                image: image || null,
                userId: user.uid,
                userEmail: user.email,
                status: 'Pending',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                lostFoundForm.reset();
                alert('Item posted successfully!');
            }).catch((error) => {
                console.error("Error adding document: ", error);
                alert('Error posting item.');
            });
        } else {
            alert('You must be logged in to post.');
        }
    });

    // Real-time Listener
    db.collection('lost_found_items').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
        itemsList.innerHTML = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString() : '';
            const statusColor = data.status === 'Found' ? 'success' : 'warning';

            const html = `
                <div class="list-group-item p-3">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1 text-saylani-blue">
                            <span class="badge bg-${data.type === 'Lost' ? 'danger' : 'success'} me-2">${data.type}</span>
                            ${data.title}
                        </h5>
                        <small class="text-muted">${date}</small>
                    </div>
                    <p class="mb-1">${data.description}</p>
                    ${data.image ? `<img src="${data.image}" alt="Item Image" class="img-thumbnail mt-2" style="max-height: 150px;">` : ''}
                    <div class="mt-2 d-flex justify-content-between align-items-center">
                        <small class="text-muted">Posted by: ${data.userEmail}</small>
                        <span class="badge bg-${statusColor}">${data.status}</span>
                    </div>
                </div>
            `;
            itemsList.insertAdjacentHTML('beforeend', html);
        });
        if (snapshot.empty) {
            itemsList.innerHTML = '<div class="p-4 text-center text-muted">No items found.</div>';
        }
    });
}

// === Complaints Logic ===
const complaintForm = document.getElementById('complaint-form');
const complaintsList = document.getElementById('complaints-list');

if (complaintForm && complaintsList) {
    // Submit Complaint
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('complaint-category').value;
        const desc = document.getElementById('complaint-desc').value;
        const user = auth.currentUser;

        if (user) {
            db.collection('complaints').add({
                category: category,
                description: desc,
                userId: user.uid,
                userEmail: user.email,
                status: 'Submitted',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                complaintForm.reset();
                alert('Complaint submitted successfully!');
            }).catch((error) => {
                console.error("Error adding document: ", error);
                alert('Error submitting complaint.');
            });
        }
    });

    // Real-time Listener (User Specific)
    auth.onAuthStateChanged((user) => {
        if (user) {
            db.collection('complaints')
                .where('userId', '==', user.uid)
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    complaintsList.innerHTML = '';
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString() : '';
                        let statusBadge = 'bg-secondary';
                        if (data.status === 'In Progress') statusBadge = 'bg-warning text-dark';
                        if (data.status === 'Resolved') statusBadge = 'bg-success';

                        const html = `
                        <div class="list-group-item p-3">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1 text-saylani-green">${data.category}</h5>
                                <span class="badge ${statusBadge}">${data.status}</span>
                            </div>
                            <p class="mb-1">${data.description}</p>
                            <small class="text-muted">Submitted on: ${date}</small>
                        </div>
                    `;
                        complaintsList.insertAdjacentHTML('beforeend', html);
                    });
                    if (snapshot.empty) {
                        complaintsList.innerHTML = '<div class="p-4 text-center text-muted">No complaints submitted yet.</div>';
                    }
                });
        }
    });
}

// === Volunteer Logic ===
const volunteerForm = document.getElementById('volunteer-form');
const volunteersList = document.getElementById('volunteers-list');
const loadingSpinner = document.getElementById('loading-spinner');

if (volunteerForm && volunteersList) {
    // Register Volunteer
    volunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('vol-name').value;
        const event = document.getElementById('vol-event').value;
        const availability = document.getElementById('vol-availability').value;
        const user = auth.currentUser;

        if (user) {
            db.collection('volunteers').add({
                name: name,
                event: event,
                availability: availability,
                userId: user.uid,
                userEmail: user.email,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                volunteerForm.reset();
                alert('Registered as volunteer successfully!');
            }).catch((error) => {
                console.error("Error adding document: ", error);
                alert('Error registering volunteer.');
            });
        }
    });

    // Real-time Listener (Admin View - All Volunteers)
    db.collection('volunteers').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
        volunteersList.innerHTML = '';
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        snapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString() : '';

            const html = `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.event}</td>
                    <td><span class="badge bg-saylani-green">${data.availability}</span></td>
                    <td>${date}</td>
                </tr>
            `;
            volunteersList.insertAdjacentHTML('beforeend', html);
        });
        if (snapshot.empty) {
            volunteersList.innerHTML = '<tr><td colspan="4" class="text-center p-4 text-muted">No volunteers registered yet.</td></tr>';
        }
    });
}
