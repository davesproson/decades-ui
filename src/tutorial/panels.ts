
import { setFilterText } from "../redux/filterSlice"
import { unselectAllParams, toggleParamSelected } from "../redux/parametersSlice"
import { setTimeframe } from "../redux/optionsSlice"
import { saveView, clearSavedViews, reset } from "../redux/viewSlice"
import { v4 as uuidv4 } from 'uuid'

import { libraryViews } from "../views/libraryEntries"

const getElementByIdOrWarn = (id: string): HTMLElement | null => {
    const ele = document.getElementById(id)
    if(!ele) console.warn(`Could not find element with id ${id}`)
    return ele
}

interface TutorialPanelConfig {
    title: string,
    text: string,
    continueText?: string,
    abortText?: string,
    hideContinue?: boolean,
    dispatch?: Array<()=>void>,
    clear?: Array<()=>void>,
    action?: () => void,
    nextRoute?: string,
}

const panels: Array<TutorialPanelConfig> = [
    {
        title: "Welcome to the DECADES visualisation software",
        text: "Would you like to take a quick tour?",
        continueText: "Yes, Please",
        abortText: "No, Thanks",
    },
    {
        title: "Parameter Selection",
        text: `This is the main parameter selection menu. Available parameters are 
                highlighted in green. Click on a parameter to select it, and click
                again to deselect it. You can select as many parameters as you like.`,
    },
    {
        title: "Parameter Selection",
        text: `You can filter the list of parameters by typing in the search box 
               at the top of the screen. I've typed "temperature" for you. Try typing 
               something yourself.`,
        dispatch: [()=>setFilterText({filterText: "temperature"})],
        clear: [()=>setFilterText({filterText: ""})]
    },
    {
        title: "Plotting",
        text: `The most important part of the DECADES display software is the plot.
               Once at least one parameter is selected, you can click the "Plot" button,
               which will open a new window with the plot. Try it now, I've selected a
               temperature and a dewpoint parameter for you.`,
        dispatch: [
            () => unselectAllParams(),
            () => toggleParamSelected({id: "521"}),
            () => toggleParamSelected({id: "529"}),
        ],
        clear: [() => unselectAllParams()],
    },
    {
        title: "Plotting",
        text: `The plot window has a number of features. You can zoom in and out by
                clicking and dragging on the plot, or by using the zoom buttons at the
                top of the plot. You can also pan the plot by clicking and dragging
                anywhere on the plot while holding ctrl. Double clicking will reset the
                plot. You can also use the buttons in the top right of the plot. Try it now.`,
    },
    {
        title: "Customising the Plot",
        text: `Plots are very customisable. The timeframe over which to plot can be
               changed by clicking on the "Timeframe" menu at the top of the page.
               I've done this for you.`,
        action: () => {
            const el = getElementByIdOrWarn("timeframe-navbar-name")
            el && el.click()
        }
    },
    {
        title: "Customising the Plot",
        text: `You can either select a preset timeframe, or enter a custom timeframe.
               Let's see how to do that. Click on the "Custom..." menu item, and/or click 
               Continue.`,
        nextRoute: "/timeframe",
    },
    {
        title: "Selecting a timeframe",
        text: `Here you can select a custom timeframe. Be sure to click "Apply" when you've 
               changed the time. If the end time is "ongoing", the plot will update as new
               data become available. Give it a try now.`,
        action: () => {
            const tf = getElementByIdOrWarn("timeframe-navbar")
            const tfItem = getElementByIdOrWarn("timeframe-navbar-item")
            if(!(tf && tfItem)) return
            if(tf.classList.contains("is-active")) tfItem.click()
        },
        nextRoute: "/options"
    },
    {
        title: "Customising the Plot",
        text: `This is the options page, reached by clicking the "Options" button at the top
                of the page (it will currently read "Home"). Here you can change the plot
                orientation, style, add a data header, change the ordinate variable, and
                select which server to use.`,
        dispatch: [
            () => unselectAllParams(),
            () => toggleParamSelected({id: "521"}),
            () => toggleParamSelected({id: "529"}),
            () => setTimeframe({value: "5min"}),
        ],
    },
    {
        title: "Customising the Plot",
        text: `You can also select which axis to place parameters on. By default, parameters
               with the same units will be placed on the same axis. You can change this by
                clicking the "+" button. Try it now. The plots work well with up to 4 axes,
                depending on the width of your device, but you can add more if you like.`,
        nextRoute: "/",
    },
    {
        title: "Tephigrams",
        text: `The tephigram button is available when at least one true air temperature (C)
               and one dewpoint (C) parameter are selected. Click it to open a tephigram plot.
               Timeframe and server options apply to tephigrams, but other options do not.
               The Tephigram button should currently be enabled - try it now.`,
        dispatch: [
            () => unselectAllParams(),
            () => toggleParamSelected({id: "521"}),
            () => toggleParamSelected({id: "529"}),
            () => setTimeframe({value: "30min"}),
        ]
    },
    {
        title: "Dashboard",
        text: `The dashboard button is available when at least one parameter is selected.
               The dashboard is a quick way to view the most recent values of selected
               parameters. Click the dashboard button to open the dashboard. Try it now.`,
        dispatch: [
            () => unselectAllParams(),
            () => toggleParamSelected({id: "521"}),
            () => toggleParamSelected({id: "529"}),
            () => toggleParamSelected({id: "517"}),
            () => toggleParamSelected({id: "551"}),
            () => toggleParamSelected({id: "570"}),
            () => toggleParamSelected({id: "571"}),
            () => toggleParamSelected({id: "662"}),
            () => toggleParamSelected({id: "663"}),
        ]
    },
    {
        title: "Dashboard",
        text: `Each panel on the dashboard shows the most recent value of a parameter. You can
               set maximum and minimum values for each parameter, and the panel will turn
               red if the value is outside the range. To do this, click the exclamation mark
               in the top right of the panel. Try it now.`,
    },
    {
        title: "Views",
        text: `Views provide a way to composite multiple plots or dashboards (for example)
               into a single page. The views menu should now be open. Let's look at the
               views library first. Click "Library..." and/or Continue...`,
        action: () => {
            const views = getElementByIdOrWarn("views-navbar")
            const viewsItem = getElementByIdOrWarn("views-navbar-item")
            if(!(views && viewsItem)) return
            if(!views.classList.contains("is-active")) viewsItem.click()
        },
        nextRoute: "/view-library"
    },
    {
        title: "The View Library",
        text: `The view library is a collection of views that have been created for you.
               You can make a view available by clicking the "Load" button next to the
               view description. The first view is called "${libraryViews[0].title}", 
               try loading it now.`,
        action: () => {
            const views = getElementByIdOrWarn("views-navbar")
            const viewsItem = getElementByIdOrWarn("views-navbar-item")
            if(!(views && viewsItem)) return
            if(views.classList.contains("is-active")) viewsItem.click()
        }
    },
    {
        title: "The View Library",
        text: `Once loaded, the view will be avaiable in the "Views" menu. Click it
               and/or Continue... to go to the view configuration page.`,
        action: () => {
            const views = getElementByIdOrWarn("views-navbar")
            const viewsItem = getElementByIdOrWarn("views-navbar-item")
            if(!(views && viewsItem)) return
            if(!views.classList.contains("is-active")) viewsItem.click()
        },
        dispatch: [
            () => clearSavedViews(),
            () => saveView({name: libraryViews[0].title, id: uuidv4(), ...libraryViews[0].config})
        ],
        nextRoute: "/config-view"
    },
    {
        title: "View Configuration",
        text: `This is the view configuration page, which is where you can build your own views.
               We've got here by selecting a loaded view, so it's already configured. You can
               launch the view by clicking the blue "Plot" button under the "Plot Configurations"
               panel. Try it now.`,
        action: () => {
            const views = getElementByIdOrWarn("views-navbar")
            const viewsItem = getElementByIdOrWarn("views-navbar-item")
            if(!(views && viewsItem)) return
            if(views.classList.contains("is-active")) viewsItem.click()
        },
    },
    {
        title: "View Configuration",
        text : `To build your own view, simlply select the number of rows and columns you want
                in the view, and then add the URLs of the visualisations you want to include to
                the address bars. Clicking "Use current config" will add the currently configured
                plot to the view. Give it a try now.`,
        dispatch: [() => reset()],
    }, 
    {
        title: "Persisting View Configurations",
        text: `Once configured, you can save your view by clicking the "Save" button. This
               will save the view in the view menu for the rest of your session. You can
               also "Export" the view to a file, which you can then "Import" later to reuse 
               or share with others.`,
        nextRoute: "/"
    }, 
    {
        title: "That's all folks!",
        text: `Thanks for taking the time to try out DECADES visualisation. If you have
                any questions or feedback, please contact FAAM, or see the full 
                documentation on the FAAM website.`,
        hideContinue: true,
        abortText: "Finish",
        dispatch: [
            () => clearSavedViews(),
            () => reset(),
            () => unselectAllParams()
        ]
    }
]

export { panels }