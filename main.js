/*global $*/
$('#form').on("submit", (e) => {

  // 既存処理をスキップする
  e.preventDefault();

  /* 
   * 送信時の処理
   */

  //  各入力項目の値を取得する
  const teamName = $("#teamName").val();
  const name = $("#name").val();
  const mail = $("#mail").val();
  const location = $("#location").val();
  /*global moment*/
  const date = moment($("#date").val()).format("YYYYMMDD");
  
  //  realtime databaseに登録する
  /*global firebase*/
  firebase
    .database()
    .ref('reservations')
    .push({
      teamName: teamName,
      name: name,
      mail: mail,
      location: location,
      date: date,
      order: -date
      
    });


});

const createReservationTr = (reservationId, reservationData) => {
 
  const $divTag = $('#reservation-template .reservation-item').clone();

  // チーム名を表示する
  $divTag.find('.reservation-item__team-name').text(reservationData.teamName);
  // 日程を表示する
  $divTag.find('.reservation-item__date').text(moment(reservationData.date, "YYYYMMDD").format("YYYY/MM/DD"));

 

  // id属性をセット
  $divTag.attr('id', `reservation-id-${reservationId}`);



  return $divTag;
};

//データを表示する
const addReservation = (reservationId, reservationData) => {
  const $divTag = createReservationTr(reservationId, reservationData);
  $divTag.appendTo('#reservation-list');
};

// 予約データを取得
const reservationRef = firebase
  .database()
  .ref('reservations')
  .orderByChild('order');

// （データベースに予約が追加保存されたときの処理）
reservationRef.on('child_added', (reservationSnapshot) => {
  const reservationId = reservationSnapshot.key;
  const reservationData = reservationSnapshot.val();


  addReservation(reservationId, reservationData);
});

// child_removedイベントハンドラを登録 
reservationRef.on('child_removed', (reservationSnapshot) => {
  const reservationId = reservationSnapshot.key;
  const $reservation = $(`#reservation-id-${reservationId}`);

  $reservation.remove();
});
