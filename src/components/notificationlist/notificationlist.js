import "./notificationlist.css";
import AvatarUtils from "../../utils/avatarUtils";
import eyeImage from "../../resources/eye.png";
import openImage from "../../resources/open.png";
import UserNotificationAction from "../../actions/userNotificationAction";

export default function NotificationList({
    setOpenNotificationList,
    notifications,
}) {
    const formatter = new Intl.DateTimeFormat("ru", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
    function openCardModal(cardId) {
        const cardDiv = document.getElementById("card." + cardId);
        setOpenNotificationList(false);
        if(cardId !== null){
            cardDiv.click(cardId);
        }
    }
    function setNotificated(notificate) {
        UserNotificationAction.updateUserNotification(notificate);
    }
    return (
        <div className="notification-list-container">
        {notifications.map((notificate) => {
            return (
            <div className="notificate-container" key={notificate.id}>
                <div className="notificate">
                <div className="notificate-info">
                    <div className="notificate-delay">
                    {notificate.createUserAvatar ? (
                        <img
                        alt="avatar"
                        className="notify-creator-avatar"
                        src={notificate.createUserAvatar}
                        />
                    ) : (
                        <div className="avatar-replacer">
                        {AvatarUtils.getAvatarReplacerText(
                            notificate.createUserName,
                            notificate.createUserEmail
                        )}
                        </div>
                    )}
                    </div>
                    <div className="notificate-date">
                    <div className="notificate__delay">{notificate.delay}</div>
                    {formatter.format(notificate.date.toDate())}
                    </div>
                </div>
                <div className="notificate-user-delay">
                    <input
                    type="image"
                    src={eyeImage}
                    alt="eye"
                    onClick={() => setNotificated(notificate)}
                    />
                    <input
                    type="image"
                    src={openImage}
                    alt="open"
                    onClick={(e) => {
                        openCardModal(notificate.cardId);
                    }}
                    />
                </div>
                </div>
            </div>
            );
        })}
        </div>
    );
}
