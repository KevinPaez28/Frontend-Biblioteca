import Swal from 'sweetalert2'

export const success = (message) => {
    return Swal.fire({
        title: message,
        icon: "success",
        draggable: true,
        customClass: {
            container: 'swal-over-modal'
        }
    });
}

export const error = (message) => {
    return Swal.fire({
        title: 'Ups, se presentó un error',
        text: message,
        icon: "error",
        draggable: true,
        customClass: {
            container: 'swal-over-modal'
        }
    });
}

export const confirm = (message) => {
    return Swal.fire({
        title: "Precaución",
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        customClass: {
            container: 'swal-over-modal'
        }
    })
}
