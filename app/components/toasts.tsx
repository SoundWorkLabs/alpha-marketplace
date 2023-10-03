import { toast } from "react-hot-toast";

const defaultToastStyles = {
    borderRadius: "0px",
    border: "1px solid black",
    width: "200vw"
};

export function notifyErr(errMsg?: string) {
    toast.error(`Error: ${errMsg}`, {
        style: { ...defaultToastStyles }
    });
}

export function notifySuccess(msg?: string) {
    toast.success(msg ?? "success..", {
        style: { ...defaultToastStyles }
    });
}

export function notifyLoading(loadingMsg?: string): string {
    // let id = toast.loading('Uploading Assets and Minting your NFT...', {
    let id = toast.loading(loadingMsg ?? "loading...", {
        style: { ...defaultToastStyles }
    });
    return id;
}

// todo: use modals for these
// function notificationHandler(isErr?: boolean, isComplete?: boolean, prom?: Promise<string>) {
//     const id = notifications.show({
//         loading: true,
//         title: 'Uploading NFT Assets',
//         message: 'Your NFT is being created. This might take some while',
//         autoClose: false,
//         withCloseButton: false,
//     });

//     if (isErr) {
//         notifications.show({
//             title: 'An Error Occurred when minting your NFT',
//             message: 'message goes here',
//             // classNames: classes,
//         })
//     }

//     // show completed notification
//     notifications.update({
//         id,
//         color: 'teal',
//         title: 'Data was loaded',
//         message: 'Notification will close in 2 seconds, you can close this notification now',
//         icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
//         loading: false,
//         autoClose: 2000,
//     })
// }
