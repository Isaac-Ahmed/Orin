let currentOutputView =
    "terminal";


function showOutputView(
    view
){
    const terminalPanel =
        document.getElementById(
            "codeOutput"
        );

    const sqlPanel =
        document.getElementById(
            "sqlResultsPanel"
        );

    const switchButton =
        document.getElementById(
            "outputSwitchButton"
        );


    if(
        !terminalPanel ||
        !sqlPanel ||
        !switchButton
    ){
        return;
    }


    currentOutputView =
        view;


    const showSQL =
        view === "sql";


    terminalPanel.classList.toggle(
        "hidden",
        showSQL
    );

    sqlPanel.classList.toggle(
        "hidden",
        !showSQL
    );


    switchButton.textContent =
        showSQL
            ? "Terminal"
            : "SQL Results";


    if(
        !showSQL &&
        typeof terminalEditor !==
            "undefined" &&
        terminalEditor
    ){
        terminalEditor.layout();
    }
}


function toggleOutputView(){
    if(
        currentOutputView ===
            "terminal"
    ){
        showOutputView(
            "sql"
        );

        return;
    }


    showOutputView(
        "terminal"
    );
}


window.showOutputView =
    showOutputView;

window.toggleOutputView =
    toggleOutputView;