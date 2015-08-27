
function showModalDialog(id, url, data) {
    $.ajax({
        url: url,
        type: "GET",
        data: data,
        success: function (data) {
            $(data).modal({
                "show": true
            })
            .on("hide.bs.modal", function () {
                $(".modal-backdrop.in").remove();
                console.log("|||||" + id);
                $("#" + id).remove();
            });
        },
        error: function (xhr,status,error) {
            
        }
    });
}
