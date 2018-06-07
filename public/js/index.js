function validatePassword() {
    if($("name=['guestsPwd']").val().length == 0)
      $("name=['guestsPwd']").val('guest');
    return false;
}