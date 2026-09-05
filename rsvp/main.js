const googleForm = {
    actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfKDRx99Xwhn4FosHHRSjfZGi0Kv2xRXAj3xJlzqbN0497Ilw/formResponse",
    entries: {
        guestName: "entry.1499645551",
        attendance: "entry.1895166149",
        plusOne: "entry.848753092",
        plusOneName: "entry.2021388576"
    }
};

/*
   Add your invited guests here when your master list is ready.
   Use a lowercase version of each name as the key. A guest without an entry
    is safely assigned one seat by default.
*/
const guestInvitations = {
     // "juan dela cruz": { seats: 1 },
     // "maria santos": { seats: 2 }
};

const rsvpForm =
    document.getElementById("rsvpForm");

const successCard =
    document.getElementById("successCard");

const formStatus =
    document.getElementById("formStatus");

const attendingConfirmation =
    document.getElementById("attendingConfirmation");

const decliningConfirmation =
    document.getElementById("decliningConfirmation");

const attendanceDetails =
    document.getElementById("attendanceDetails");

const declineMessage =
    document.getElementById("declineMessage");

const plusOneSection =
    document.getElementById("plusOneSection");

const plusOneDetails =
    document.getElementById("plusOneDetails");

const guestNameInput =
    document.getElementById("guestName");

function normalizeGuestName(name) {

    return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function getGuestInvitation() {

    const guestName = normalizeGuestName(guestNameInput?.value || "");

    return guestInvitations[guestName] || {
        seats: 1
    };
}

function updateInvitationDetails() {

    const invitation = getGuestInvitation();
    const name = guestNameInput?.value.trim() || "Your name";
    const reservedGuestName = document.getElementById("reservedGuestName");
    const reservedSeats = document.getElementById("reservedSeats");

    if (reservedGuestName) reservedGuestName.textContent = name;

    if (reservedSeats) {
        reservedSeats.textContent = invitation.seats === 1
            ? "We have reserved 1 seat for you."
            : `We have reserved ${invitation.seats} seats for you.`;
    }

    if (plusOneSection) plusOneSection.hidden = false;

    togglePlusOneDetails();
}

function togglePlusOneDetails() {

    const hasPlusOne = document.querySelector('input[name="plusOne"]:checked')?.value === "Yes";
    const plusOneName = document.getElementById("plusOneName");

    if (plusOneDetails) plusOneDetails.hidden = !hasPlusOne;
    if (plusOneName) plusOneName.required = hasPlusOne;
}

function updateAttendanceFields() {

    const isAttending = getSelectedAttendance() === "Yes";

    if (attendanceDetails) attendanceDetails.hidden = !isAttending;
    if (declineMessage) declineMessage.hidden = getSelectedAttendance() !== "No";

    if (isAttending) {
        updateInvitationDetails();
    } else {
        const plusOneName = document.getElementById("plusOneName");
        if (plusOneName) plusOneName.required = false;
    }
}

function isGoogleFormConfigured() {

    return googleForm.actionUrl.includes("formResponse") &&
        Object.values(googleForm.entries).every(entry =>
            !entry || !entry.includes("REPLACE")
        );
}

function setStatus(message, type) {

    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = `form-status ${type || ""}`.trim();
}

function getSelectedAttendance() {

    const selected =
        rsvpForm.querySelector("input[name='attendance']:checked");

    return selected ? selected.value : "";
}

function getRsvpValues() {

    const isAttending = getSelectedAttendance() === "Yes";
    const values = {
        [googleForm.entries.guestName]:
            document.getElementById("guestName").value.trim(),
        [googleForm.entries.attendance]:
            getSelectedAttendance(),
        [googleForm.entries.plusOne]:
            isAttending
                ? document.querySelector('input[name="plusOne"]:checked')?.value || "No"
                : ""
    };

    if (isAttending) {
        const optionalFields = {
            plusOneName: document.getElementById("plusOneName").value.trim()
        };

        Object.entries(optionalFields).forEach(([field, value]) => {
            if (googleForm.entries[field]) values[googleForm.entries[field]] = value;
        });
    }

    return values;
}

function showSuccess() {

    const isAttending = getSelectedAttendance() === "Yes";

    if (attendingConfirmation) attendingConfirmation.hidden = !isAttending;
    if (decliningConfirmation) decliningConfirmation.hidden = isAttending;
    document.body.classList.add("success-state");
    rsvpForm.closest(".rsvp-card").hidden = true;
    successCard.hidden = false;
    successCard.scrollIntoView({ behavior: "smooth" });
}

function submitToGoogleForm(values) {

    return new Promise(resolve => {

        const iframeName = "googleFormSubmitFrame";

        let iframe =
            document.querySelector(`iframe[name="${iframeName}"]`);

        if (!iframe) {

            iframe = document.createElement("iframe");
            iframe.name = iframeName;
            iframe.hidden = true;
            document.body.appendChild(iframe);

        }

        const googlePostForm =
            document.createElement("form");

        googlePostForm.action = googleForm.actionUrl;
        googlePostForm.method = "POST";
        googlePostForm.target = iframeName;
        googlePostForm.hidden = true;

        Object.entries(values).forEach(([name, value]) => {

            const input = document.createElement("input");

            input.type = "hidden";
            input.name = name;
            input.value = value;

            googlePostForm.appendChild(input);

        });

        document.body.appendChild(googlePostForm);

        iframe.addEventListener(
            "load",
            () => {

                googlePostForm.remove();
                resolve();

            },
            { once: true }
        );

        googlePostForm.submit();

        setTimeout(() => {

            if (document.body.contains(googlePostForm))
                googlePostForm.remove();

            resolve();

        }, 2500);

    });
}

if (rsvpForm && successCard) {

    rsvpForm.querySelectorAll("input[name='attendance']")
        .forEach(input => input.addEventListener("change", updateAttendanceFields));

    rsvpForm.querySelectorAll("input[name='plusOne']")
        .forEach(input => input.addEventListener("change", togglePlusOneDetails));

    if (guestNameInput) {
        guestNameInput.addEventListener("input", () => {
            if (getSelectedAttendance() === "Yes") updateInvitationDetails();
        });
    }

    updateAttendanceFields();

    rsvpForm.addEventListener("submit", async event => {

        event.preventDefault();

        if (!isGoogleFormConfigured()) {

            setStatus(
                "Google Form endpoint is set. Add the entry IDs in rsvp/main.js to finish connecting it.",
                "error"
            );

            return;
        }

        const submitButton =
            rsvpForm.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        setStatus("Sending your RSVP...", "loading");

        try {

            await submitToGoogleForm(getRsvpValues());

            showSuccess();

        } catch (error) {

            setStatus(
                "Something went wrong. Please try again.",
                "error"
            );

            submitButton.disabled = false;
            submitButton.textContent = "Submit RSVP";

        }

    });

}
