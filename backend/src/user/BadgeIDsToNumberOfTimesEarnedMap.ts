/**
 * Map of finished badges</br>
 * key : badgeID,
 * associated : number of times that you earned this badge
 */
interface BadgeIDsToNumberOfTimesEarnedMap {
    [idBadge:number]: number;
}

export = BadgeIDsToNumberOfTimesEarnedMap;