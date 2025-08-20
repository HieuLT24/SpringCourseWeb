function deleteCourse(endpoint) {
    if (confirm("XOA?") === true) {
        fetch(endpoint, {
            method: "delete"
        }).then(res => {
            if (res.status == 204)
                location.reload();
            else
                alert("Loi");
        });
    }
}
