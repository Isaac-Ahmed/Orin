function getRunner(){
    return window["orinDatabaseRunnerRuntime"] || null;
}

async function getDatabase(){
    const runner =
        getRunner();

    if(
        !runner ||
        typeof runner.getDatabase !== "function"
    ){
        throw new Error(
            "database.runner is not available"
        );
    }

    return await runner.getDatabase();
}

async function getTables(){
    const database =
        await getDatabase();

    const result =
        await database.query(`
            SELECT
                table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

    return result.rows.map(
        row =>
            row.table_name
    );
}

async function getColumns(tableName){
    const database =
        await getDatabase();

    const result =
        await database.query(
            `
            SELECT
                column_name,
                data_type,
                udt_name,
                character_maximum_length,
                numeric_precision,
                numeric_scale,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = $1
            ORDER BY ordinal_position;
            `,
            [
                tableName
            ]
        );

    return result.rows.map(
        column => ({
            name:
                column.column_name,

            type:
                formatColumnType(
                    column
                ),

            nullable:
                column.is_nullable === "YES",

            default:
                column.column_default,

            primaryKey:
                false,

            foreignKey:
                false,

            unique:
                false
        })
    );
}

async function getPrimaryKeys(tableName){
    const database =
        await getDatabase();

    const result =
        await database.query(
            `
            SELECT
                kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
               AND tc.constraint_schema = kcu.constraint_schema
            WHERE tc.constraint_type = 'PRIMARY KEY'
              AND tc.table_schema = 'public'
              AND tc.table_name = $1
            ORDER BY kcu.ordinal_position;
            `,
            [
                tableName
            ]
        );

    return result.rows.map(
        row =>
            row.column_name
    );
}

async function getUniqueConstraints(tableName){
    const database =
        await getDatabase();

    const result =
        await database.query(
            `
            SELECT
                tc.constraint_name,
                kcu.column_name,
                kcu.ordinal_position
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
               AND tc.constraint_schema = kcu.constraint_schema
            WHERE tc.constraint_type = 'UNIQUE'
              AND tc.table_schema = 'public'
              AND tc.table_name = $1
            ORDER BY
                tc.constraint_name,
                kcu.ordinal_position;
            `,
            [
                tableName
            ]
        );

    const constraints =
        new Map();

    for(
        const row
        of result.rows
    ){
        if(
            !constraints.has(
                row.constraint_name
            )
        ){
            constraints.set(
                row.constraint_name,
                []
            );
        }

        constraints.get(
            row.constraint_name
        ).push(
            row.column_name
        );
    }

    return Array.from(
        constraints.values()
    );
}

async function getForeignKeys(tableName){
    const database =
        await getDatabase();

    const result =
        await database.query(
            `
            SELECT
                tc.constraint_name,
                kcu.column_name,
                ukcu.table_name AS referenced_table,
                ukcu.column_name AS referenced_column,
                kcu.ordinal_position
            FROM information_schema.table_constraints tc
            JOIN information_schema.referential_constraints rc
                ON tc.constraint_name = rc.constraint_name
               AND tc.constraint_schema = rc.constraint_schema
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
               AND tc.constraint_schema = kcu.constraint_schema
            JOIN information_schema.key_column_usage ukcu
                ON rc.unique_constraint_name =
                    ukcu.constraint_name
               AND rc.unique_constraint_schema =
                    ukcu.constraint_schema
               AND kcu.position_in_unique_constraint =
                    ukcu.ordinal_position
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND tc.table_schema = 'public'
              AND tc.table_name = $1
            ORDER BY
                tc.constraint_name,
                kcu.ordinal_position;
            `,
            [
                tableName
            ]
        );

    return result.rows.map(
        row => ({
            constraint:
                row.constraint_name,

            column:
                row.column_name,

            referencedTable:
                row.referenced_table,

            referencedColumn:
                row.referenced_column
        })
    );
}

function formatColumnType(column){
    let type =
        column.data_type.toUpperCase();

    if(
        type === "CHARACTER VARYING"
    ){
        type =
            "VARCHAR";
    }

    if(
        type === "CHARACTER"
    ){
        type =
            "CHAR";
    }

    if(
        type === "USER-DEFINED"
    ){
        type =
            String(
                column.udt_name
            ).toUpperCase();
    }

    if(
        column.character_maximum_length !==
        null
    ){
        return (
            `${type}(` +
            `${column.character_maximum_length}` +
            `)`
        );
    }

    if(
        type === "NUMERIC" &&
        column.numeric_precision !== null
    ){
        if(
            column.numeric_scale !==
            null
        ){
            return (
                `NUMERIC(` +
                `${column.numeric_precision}, ` +
                `${column.numeric_scale}` +
                `)`
            );
        }

        return (
            `NUMERIC(` +
            `${column.numeric_precision}` +
            `)`
        );
    }

    return type;
}

function sameColumns(first, second){
    if(
        first.length !==
        second.length
    ){
        return false;
    }

    const values =
        new Set(
            first
        );

    for(
        const value
        of second
    ){
        if(
            !values.has(
                value
            )
        ){
            return false;
        }
    }

    return true;
}

function isUniqueForeignKey(
    columns,
    primaryKeys,
    uniqueConstraints
){
    if(
        sameColumns(
            columns,
            primaryKeys
        )
    ){
        return true;
    }

    for(
        const constraint
        of uniqueConstraints
    ){
        if(
            sameColumns(
                columns,
                constraint
            )
        ){
            return true;
        }
    }

    return false;
}

function validateSchema(schema){
    if(
        typeof schema !== "object" ||
        schema === null ||
        schema.__orinModuleType !==
            "database.schema" ||
        !Array.isArray(
            schema.tables
        ) ||
        !Array.isArray(
            schema.relationships
        )
    ){
        throw new Error(
            "value must be a database.schema"
        );
    }
}

function getTableWidth(table){
    let longest =
        table.name.length;

    for(
        const column
        of table.columns
    ){
        longest =
            Math.max(
                longest,
                column.name.length +
                column.type.length +
                8
            );
    }

    return Math.max(
        230,
        Math.min(
            350,
            100 +
            longest * 7
        )
    );
}

function createTableElement(
    document,
    table
){
    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "schema-table";

    wrapper.dataset.table =
        table.name;

    wrapper.style.width =
        `${getTableWidth(table)}px`;

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "schema-table-header";

    header.textContent =
        table.name;

    wrapper.appendChild(
        header
    );

    const headings =
        document.createElement(
            "div"
        );

    headings.className =
        "schema-row schema-headings";

    for(
        const value
        of [
            "Key",
            "Name",
            "Type"
        ]
    ){
        const cell =
            document.createElement(
                "div"
            );

        cell.textContent =
            value;

        headings.appendChild(
            cell
        );
    }

    wrapper.appendChild(
        headings
    );

    for(
        const column
        of table.columns
    ){
        const row =
            document.createElement(
                "div"
            );

        row.className =
            "schema-row";

        let keyText =
            "";

        if(
            column.primaryKey &&
            column.foreignKey
        ){
            keyText =
                "PK/FK";
        }
        else if(
            column.primaryKey
        ){
            keyText =
                "PK";
        }
        else if(
            column.foreignKey
        ){
            keyText =
                "FK";
        }

        const key =
            document.createElement(
                "div"
            );

        key.className =
            "schema-key";

        key.textContent =
            keyText;

        const name =
            document.createElement(
                "div"
            );

        name.textContent =
            column.name;

        const type =
            document.createElement(
                "div"
            );

        type.className =
            "schema-type";

        type.textContent =
            column.type;

        row.append(
            key,
            name,
            type
        );

        wrapper.appendChild(
            row
        );
    }

    return wrapper;
}

function getDegreeMap(schema){
    const degrees =
        new Map();

    for(
        const table
        of schema.tables
    ){
        degrees.set(
            table.name,
            0
        );
    }

    for(
        const relationship
        of schema.relationships
    ){
        if(
            relationship.fromTable ===
            relationship.toTable
        ){
            degrees.set(
                relationship.fromTable,
                degrees.get(
                    relationship.fromTable
                ) + 1
            );

            continue;
        }

        degrees.set(
            relationship.fromTable,
            degrees.get(
                relationship.fromTable
            ) + 1
        );

        degrees.set(
            relationship.toTable,
            degrees.get(
                relationship.toTable
            ) + 1
        );
    }

    return degrees;
}

function getUndirectedGraph(schema){
    const graph =
        new Map();

    for(
        const table
        of schema.tables
    ){
        graph.set(
            table.name,
            new Set()
        );
    }

    for(
        const relationship
        of schema.relationships
    ){
        if(
            relationship.fromTable ===
            relationship.toTable
        ){
            continue;
        }

        graph.get(
            relationship.fromTable
        ).add(
            relationship.toTable
        );

        graph.get(
            relationship.toTable
        ).add(
            relationship.fromTable
        );
    }

    return graph;
}

function getConnectedComponents(schema){
    const graph =
        getUndirectedGraph(
            schema
        );

    const visited =
        new Set();

    const components =
        [];

    for(
        const table
        of schema.tables
    ){
        if(
            visited.has(
                table.name
            )
        ){
            continue;
        }

        const component =
            [];

        const stack = [
            table.name
        ];

        visited.add(
            table.name
        );

        while(
            stack.length > 0
        ){
            const current =
                stack.pop();

            component.push(
                current
            );

            for(
                const next
                of graph.get(current)
            ){
                if(
                    visited.has(next)
                ){
                    continue;
                }

                visited.add(
                    next
                );

                stack.push(
                    next
                );
            }
        }

        components.push(
            component
        );
    }

    return components;
}

function getComponentEdges(
    schema,
    component
){
    const names =
        new Set(
            component
        );

    const seen =
        new Set();

    const edges =
        [];

    for(
        const relationship
        of schema.relationships
    ){
        if(
            relationship.fromTable ===
            relationship.toTable
        ){
            continue;
        }

        if(
            !names.has(
                relationship.fromTable
            ) ||
            !names.has(
                relationship.toTable
            )
        ){
            continue;
        }

        const pair =
            [
                relationship.fromTable,
                relationship.toTable
            ].sort();

        const key =
            pair[0] +
            "::" +
            pair[1];

        if(
            seen.has(key)
        ){
            continue;
        }

        seen.add(
            key
        );

        edges.push({
            first:
                pair[0],

            second:
                pair[1]
        });
    }

    return edges;
}

function createComponentNodes(
    component,
    tableElements,
    degrees
){
    const nodes =
        new Map();

    const count =
        component.length;

    const radius =
        Math.max(
            180,
            count * 65
        );

    const sorted =
        component
            .slice()
            .sort(
                (first, second) =>
                    degrees.get(second) -
                    degrees.get(first)
            );

    for(
        let i = 0;
        i < sorted.length;
        i++
    ){
        const name =
            sorted[i];

        const element =
            tableElements.get(
                name
            );

        const angle =
            (
                Math.PI * 2 *
                i /
                Math.max(
                    count,
                    1
                )
            );

        nodes.set(
            name,
            {
                name:
                    name,

                element:
                    element,

                width:
                    element.offsetWidth,

                height:
                    element.offsetHeight,

                degree:
                    degrees.get(name),

                x:
                    count === 1
                        ? 0
                        : Math.cos(angle) *
                            radius,

                y:
                    count === 1
                        ? 0
                        : Math.sin(angle) *
                            radius,

                vx:
                    0,

                vy:
                    0
            }
        );
    }

    return nodes;
}

function applyComponentRepulsion(nodes){
    const values =
        Array.from(
            nodes.values()
        );

    const strength =
        65000;

    for(
        let i = 0;
        i < values.length;
        i++
    ){
        const first =
            values[i];

        for(
            let j = i + 1;
            j < values.length;
            j++
        ){
            const second =
                values[j];

            let dx =
                second.x -
                first.x;

            let dy =
                second.y -
                first.y;

            let distanceSquared =
                dx * dx +
                dy * dy;

            if(
                distanceSquared < 4
            ){
                dx =
                    2;

                dy =
                    2;

                distanceSquared =
                    8;
            }

            const distance =
                Math.sqrt(
                    distanceSquared
                );

            const force =
                strength /
                distanceSquared;

            const xForce =
                dx /
                distance *
                force;

            const yForce =
                dy /
                distance *
                force;

            first.vx -=
                xForce;

            first.vy -=
                yForce;

            second.vx +=
                xForce;

            second.vy +=
                yForce;
        }
    }
}

function applyComponentSprings(
    nodes,
    edges
){
    const strength =
        0.025;

    for(
        const edge
        of edges
    ){
        const first =
            nodes.get(
                edge.first
            );

        const second =
            nodes.get(
                edge.second
            );

        const dx =
            second.x -
            first.x;

        const dy =
            second.y -
            first.y;

        const distance =
            Math.max(
                1,
                Math.hypot(
                    dx,
                    dy
                )
            );

        const degreeSpace =
            (
                first.degree +
                second.degree
            ) *
            12;

        const desired =
            (
                first.width +
                second.width
            ) /
            2 +
            130 +
            degreeSpace;

        const difference =
            distance -
            desired;

        const force =
            difference *
            strength;

        const xForce =
            dx /
            distance *
            force;

        const yForce =
            dy /
            distance *
            force;

        first.vx +=
            xForce;

        first.vy +=
            yForce;

        second.vx -=
            xForce;

        second.vy -=
            yForce;
    }
}

function applyComponentCenter(nodes){
    for(
        const node
        of nodes.values()
    ){
        node.vx +=
            -node.x *
            0.003;

        node.vy +=
            -node.y *
            0.003;
    }
}

function updateComponentNodes(nodes){
    const damping =
        0.78;

    const maxSpeed =
        18;

    for(
        const node
        of nodes.values()
    ){
        node.vx *=
            damping;

        node.vy *=
            damping;

        const speed =
            Math.hypot(
                node.vx,
                node.vy
            );

        if(
            speed >
            maxSpeed
        ){
            node.vx =
                node.vx /
                speed *
                maxSpeed;

            node.vy =
                node.vy /
                speed *
                maxSpeed;
        }

        node.x +=
            node.vx;

        node.y +=
            node.vy;
    }
}

function resolveComponentCollisions(nodes){
    const values =
        Array.from(
            nodes.values()
        );

    for(
        let i = 0;
        i < values.length;
        i++
    ){
        const first =
            values[i];

        for(
            let j = i + 1;
            j < values.length;
            j++
        ){
            const second =
                values[j];

            const dx =
                second.x -
                first.x;

            const dy =
                second.y -
                first.y;

            const degreeGap =
                Math.max(
                    first.degree,
                    second.degree
                ) *
                10;

            const gap =
                55 +
                degreeGap;

            const requiredX =
                (
                    first.width +
                    second.width
                ) /
                2 +
                gap;

            const requiredY =
                (
                    first.height +
                    second.height
                ) /
                2 +
                gap;

            const overlapX =
                requiredX -
                Math.abs(dx);

            const overlapY =
                requiredY -
                Math.abs(dy);

            if(
                overlapX <= 0 ||
                overlapY <= 0
            ){
                continue;
            }

            if(
                overlapX <
                overlapY
            ){
                const direction =
                    dx >= 0
                        ? 1
                        : -1;

                first.x -=
                    overlapX /
                    2 *
                    direction;

                second.x +=
                    overlapX /
                    2 *
                    direction;
            }
            else{
                const direction =
                    dy >= 0
                        ? 1
                        : -1;

                first.y -=
                    overlapY /
                    2 *
                    direction;

                second.y +=
                    overlapY /
                    2 *
                    direction;
            }
        }
    }
}

function getNodeBounds(nodes){
    let left =
        Infinity;

    let right =
        -Infinity;

    let top =
        Infinity;

    let bottom =
        -Infinity;

    for(
        const node
        of nodes.values()
    ){
        left =
            Math.min(
                left,
                node.x -
                node.width /
                2
            );

        right =
            Math.max(
                right,
                node.x +
                node.width /
                2
            );

        top =
            Math.min(
                top,
                node.y -
                node.height /
                2
            );

        bottom =
            Math.max(
                bottom,
                node.y +
                node.height /
                2
            );
    }

    return {
        left:
            left,

        right:
            right,

        top:
            top,

        bottom:
            bottom,

        width:
            right -
            left,

        height:
            bottom -
            top
    };
}

function layoutComponent(
    schema,
    component,
    tableElements,
    degrees
){
    const nodes =
        createComponentNodes(
            component,
            tableElements,
            degrees
        );

    const edges =
        getComponentEdges(
            schema,
            component
        );

    if(
        nodes.size > 1
    ){
        for(
            let iteration = 0;
            iteration < 380;
            iteration++
        ){
            applyComponentRepulsion(
                nodes
            );

            applyComponentSprings(
                nodes,
                edges
            );

            applyComponentCenter(
                nodes
            );

            updateComponentNodes(
                nodes
            );

            resolveComponentCollisions(
                nodes
            );
        }

        for(
            let iteration = 0;
            iteration < 25;
            iteration++
        ){
            resolveComponentCollisions(
                nodes
            );
        }
    }

    return {
        nodes:
            nodes,

        bounds:
            getNodeBounds(
                nodes
            )
    };
}

function packComponents(
    layouts,
    width
){
    const sorted =
        layouts
            .slice()
            .sort(
                (first, second) =>
                    (
                        second.bounds.width *
                        second.bounds.height
                    ) -
                    (
                        first.bounds.width *
                        first.bounds.height
                    )
            );

    let totalArea =
        0;

    for(
        const layout
        of sorted
    ){
        totalArea +=
            (
                layout.bounds.width +
                140
            ) *
            (
                layout.bounds.height +
                140
            );
    }

    const targetWidth =
        Math.max(
            width * 1.5,
            Math.sqrt(
                totalArea
            ) * 1.35
        );

    const gap =
        140;

    let x =
        gap;

    let y =
        gap;

    let rowHeight =
        0;

    for(
        const layout
        of sorted
    ){
        const itemWidth =
            layout.bounds.width;

        const itemHeight =
            layout.bounds.height;

        if(
            x > gap &&
            x +
            itemWidth >
            targetWidth
        ){
            x =
                gap;

            y +=
                rowHeight +
                gap;

            rowHeight =
                0;
        }

        layout.offsetX =
            x -
            layout.bounds.left;

        layout.offsetY =
            y -
            layout.bounds.top;

        x +=
            itemWidth +
            gap;

        rowHeight =
            Math.max(
                rowHeight,
                itemHeight
            );
    }
}

function applyLayout(
    layouts
){
    for(
        const layout
        of layouts
    ){
        for(
            const node
            of layout.nodes.values()
        ){
            const left =
                node.x -
                node.width /
                2 +
                layout.offsetX;

            const top =
                node.y -
                node.height /
                2 +
                layout.offsetY;

            node.element.style.left =
                `${left}px`;

            node.element.style.top =
                `${top}px`;
        }
    }
}

function runLayout(
    schema,
    tableElements,
    width
){
    const components =
        getConnectedComponents(
            schema
        );

    const degrees =
        getDegreeMap(
            schema
        );

    const layouts =
        [];

    for(
        const component
        of components
    ){
        layouts.push(
            layoutComponent(
                schema,
                component,
                tableElements,
                degrees
            )
        );
    }

    packComponents(
        layouts,
        width
    );

    applyLayout(
        layouts
    );
}

function resizeCanvas(
    popup,
    canvas,
    tableElements
){
    let maximumX =
        popup.innerWidth;

    let maximumY =
        popup.innerHeight;

    for(
        const element
        of tableElements.values()
    ){
        const left =
            parseFloat(
                element.style.left
            ) || 0;

        const top =
            parseFloat(
                element.style.top
            ) || 0;

        maximumX =
            Math.max(
                maximumX,
                left +
                element.offsetWidth +
                160
            );

        maximumY =
            Math.max(
                maximumY,
                top +
                element.offsetHeight +
                160
            );
    }

    canvas.style.width =
        `${maximumX}px`;

    canvas.style.height =
        `${maximumY}px`;
}

function createSvgElement(
    document,
    name
){
    return document.createElementNS(
        "http://www.w3.org/2000/svg",
        name
    );
}

function addRelationshipMarkers(
    document,
    svg
){
    const defs =
        createSvgElement(
            document,
            "defs"
        );

    const one =
        createSvgElement(
            document,
            "marker"
        );

    one.setAttribute(
        "id",
        "schema-one"
    );

    one.setAttribute(
        "viewBox",
        "0 0 18 18"
    );

    one.setAttribute(
        "refX",
        "9"
    );

    one.setAttribute(
        "refY",
        "9"
    );

    one.setAttribute(
        "markerWidth",
        "14"
    );

    one.setAttribute(
        "markerHeight",
        "14"
    );

    one.setAttribute(
        "orient",
        "auto-start-reverse"
    );

    const onePath =
        createSvgElement(
            document,
            "path"
        );

    onePath.setAttribute(
        "d",
        (
            "M 5 2 L 5 16 " +
            "M 11 2 L 11 16"
        )
    );

    onePath.setAttribute(
        "class",
        "schema-marker"
    );

    one.appendChild(
        onePath
    );

    const many =
        createSvgElement(
            document,
            "marker"
        );

    many.setAttribute(
        "id",
        "schema-many"
    );

    many.setAttribute(
        "viewBox",
        "0 0 20 20"
    );

    many.setAttribute(
        "refX",
        "18"
    );

    many.setAttribute(
        "refY",
        "10"
    );

    many.setAttribute(
        "markerWidth",
        "17"
    );

    many.setAttribute(
        "markerHeight",
        "17"
    );

    many.setAttribute(
        "orient",
        "auto-start-reverse"
    );

    const manyPath =
        createSvgElement(
            document,
            "path"
        );

    manyPath.setAttribute(
        "d",
        (
            "M 18 10 L 3 2 " +
            "M 18 10 L 3 10 " +
            "M 18 10 L 3 18"
        )
    );

    manyPath.setAttribute(
        "class",
        "schema-marker"
    );

    many.appendChild(
        manyPath
    );

    defs.append(
        one,
        many
    );

    svg.appendChild(
        defs
    );
}

function getRect(
    element,
    canvasRect
){
    const rect =
        element.getBoundingClientRect();

    return {
        left:
            rect.left -
            canvasRect.left,

        right:
            rect.right -
            canvasRect.left,

        top:
            rect.top -
            canvasRect.top,

        bottom:
            rect.bottom -
            canvasRect.top,

        width:
            rect.width,

        height:
            rect.height,

        centerX:
            rect.left -
            canvasRect.left +
            rect.width /
            2,

        centerY:
            rect.top -
            canvasRect.top +
            rect.height /
            2
    };
}

function clamp(
    value,
    minimum,
    maximum
){
    return Math.max(
        minimum,
        Math.min(
            maximum,
            value
        )
    );
}

function getClosestPoints(
    sourceRect,
    targetRect
){
    const dx =
        targetRect.centerX -
        sourceRect.centerX;

    const dy =
        targetRect.centerY -
        sourceRect.centerY;

    if(
        Math.abs(dx) >=
        Math.abs(dy)
    ){
        if(
            dx >= 0
        ){
            return {
                start: {
                    x:
                        sourceRect.right,

                    y:
                        clamp(
                            targetRect.centerY,
                            sourceRect.top + 16,
                            sourceRect.bottom - 16
                        ),

                    side:
                        "right"
                },

                end: {
                    x:
                        targetRect.left,

                    y:
                        clamp(
                            sourceRect.centerY,
                            targetRect.top + 16,
                            targetRect.bottom - 16
                        ),

                    side:
                        "left"
                }
            };
        }

        return {
            start: {
                x:
                    sourceRect.left,

                y:
                    clamp(
                        targetRect.centerY,
                        sourceRect.top + 16,
                        sourceRect.bottom - 16
                    ),

                side:
                    "left"
            },

            end: {
                x:
                    targetRect.right,

                y:
                    clamp(
                        sourceRect.centerY,
                        targetRect.top + 16,
                        targetRect.bottom - 16
                    ),

                side:
                    "right"
            }
        };
    }

    if(
        dy >= 0
    ){
        return {
            start: {
                x:
                    clamp(
                        targetRect.centerX,
                        sourceRect.left + 16,
                        sourceRect.right - 16
                    ),

                y:
                    sourceRect.bottom,

                side:
                    "bottom"
            },

            end: {
                x:
                    clamp(
                        sourceRect.centerX,
                        targetRect.left + 16,
                        targetRect.right - 16
                    ),

                y:
                    targetRect.top,

                side:
                    "top"
            }
        };
    }

    return {
        start: {
            x:
                clamp(
                    targetRect.centerX,
                    sourceRect.left + 16,
                    sourceRect.right - 16
                ),

            y:
                sourceRect.top,

            side:
                "top"
        },

        end: {
            x:
                clamp(
                    sourceRect.centerX,
                    targetRect.left + 16,
                    targetRect.right - 16
                ),

            y:
                targetRect.bottom,

            side:
                "bottom"
        }
    };
}

function shiftPoint(
    point,
    offset
){
    if(
        point.side === "left" ||
        point.side === "right"
    ){
        return {
            x:
                point.x,

            y:
                point.y +
                offset,

            side:
                point.side
        };
    }

    return {
        x:
            point.x +
            offset,

        y:
            point.y,

        side:
            point.side
    };
}

function pointInsideRect(
    point,
    rect
){
    return (
        point.x >
            rect.left &&
        point.x <
            rect.right &&
        point.y >
            rect.top &&
        point.y <
            rect.bottom
    );
}

function segmentsIntersect(
    firstStart,
    firstEnd,
    secondStart,
    secondEnd
){
    function orientation(
        first,
        second,
        third
    ){
        return (
            (
                second.y -
                first.y
            ) *
            (
                third.x -
                second.x
            ) -
            (
                second.x -
                first.x
            ) *
            (
                third.y -
                second.y
            )
        );
    }

    const first =
        orientation(
            firstStart,
            firstEnd,
            secondStart
        );

    const second =
        orientation(
            firstStart,
            firstEnd,
            secondEnd
        );

    const third =
        orientation(
            secondStart,
            secondEnd,
            firstStart
        );

    const fourth =
        orientation(
            secondStart,
            secondEnd,
            firstEnd
        );

    return (
        (
            first > 0 &&
            second < 0
        ) ||
        (
            first < 0 &&
            second > 0
        )
    ) &&
    (
        (
            third > 0 &&
            fourth < 0
        ) ||
        (
            third < 0 &&
            fourth > 0
        )
    );
}

function segmentHitsRect(
    start,
    end,
    rect,
    padding = 16
){
    const expanded = {
        left:
            rect.left -
            padding,

        right:
            rect.right +
            padding,

        top:
            rect.top -
            padding,

        bottom:
            rect.bottom +
            padding
    };

    if(
        pointInsideRect(
            start,
            expanded
        ) ||
        pointInsideRect(
            end,
            expanded
        )
    ){
        return true;
    }

    const topLeft = {
        x:
            expanded.left,

        y:
            expanded.top
    };

    const topRight = {
        x:
            expanded.right,

        y:
            expanded.top
    };

    const bottomLeft = {
        x:
            expanded.left,

        y:
            expanded.bottom
    };

    const bottomRight = {
        x:
            expanded.right,

        y:
            expanded.bottom
    };

    return (
        segmentsIntersect(
            start,
            end,
            topLeft,
            topRight
        ) ||
        segmentsIntersect(
            start,
            end,
            topRight,
            bottomRight
        ) ||
        segmentsIntersect(
            start,
            end,
            bottomRight,
            bottomLeft
        ) ||
        segmentsIntersect(
            start,
            end,
            bottomLeft,
            topLeft
        )
    );
}

function getObstacleRects(
    tableElements,
    sourceTable,
    targetTable,
    canvasRect
){
    const obstacles =
        [];

    for(
        const element
        of tableElements.values()
    ){
        if(
            element === sourceTable ||
            element === targetTable
        ){
            continue;
        }

        obstacles.push(
            getRect(
                element,
                canvasRect
            )
        );
    }

    return obstacles;
}

function segmentBlocked(
    start,
    end,
    obstacles
){
    for(
        const obstacle
        of obstacles
    ){
        if(
            segmentHitsRect(
                start,
                end,
                obstacle
            )
        ){
            return true;
        }
    }

    return false;
}

function pathBlocked(
    points,
    obstacles
){
    for(
        let i = 0;
        i <
        points.length - 1;
        i++
    ){
        if(
            segmentBlocked(
                points[i],
                points[i + 1],
                obstacles
            )
        ){
            return true;
        }
    }

    return false;
}

function pathLength(points){
    let length =
        0;

    for(
        let i = 0;
        i <
        points.length - 1;
        i++
    ){
        length +=
            Math.hypot(
                points[i + 1].x -
                    points[i].x,
                points[i + 1].y -
                    points[i].y
            );
    }

    return length;
}

function removeDuplicatePoints(points){
    const result =
        [];

    for(
        const point
        of points
    ){
        const last =
            result[
                result.length - 1
            ];

        if(
            last &&
            last.x ===
                point.x &&
            last.y ===
                point.y
        ){
            continue;
        }

        result.push(
            point
        );
    }

    return result;
}

function choosePath(
    start,
    end,
    obstacles
){
    if(
        !segmentBlocked(
            start,
            end,
            obstacles
        )
    ){
        return [
            start,
            end
        ];
    }

    const margin =
        35;

    let minimumTop =
        Math.min(
            start.y,
            end.y
        );

    let maximumBottom =
        Math.max(
            start.y,
            end.y
        );

    let minimumLeft =
        Math.min(
            start.x,
            end.x
        );

    let maximumRight =
        Math.max(
            start.x,
            end.x
        );

    for(
        const obstacle
        of obstacles
    ){
        minimumTop =
            Math.min(
                minimumTop,
                obstacle.top
            );

        maximumBottom =
            Math.max(
                maximumBottom,
                obstacle.bottom
            );

        minimumLeft =
            Math.min(
                minimumLeft,
                obstacle.left
            );

        maximumRight =
            Math.max(
                maximumRight,
                obstacle.right
            );
    }

    const topY =
        minimumTop -
        margin;

    const bottomY =
        maximumBottom +
        margin;

    const leftX =
        minimumLeft -
        margin;

    const rightX =
        maximumRight +
        margin;

    const candidates = [
        [
            start,
            {
                x:
                    end.x,
                y:
                    start.y
            },
            end
        ],

        [
            start,
            {
                x:
                    start.x,
                y:
                    end.y
            },
            end
        ],

        [
            start,
            {
                x:
                    start.x,
                y:
                    topY
            },
            {
                x:
                    end.x,
                y:
                    topY
            },
            end
        ],

        [
            start,
            {
                x:
                    start.x,
                y:
                    bottomY
            },
            {
                x:
                    end.x,
                y:
                    bottomY
            },
            end
        ],

        [
            start,
            {
                x:
                    leftX,
                y:
                    start.y
            },
            {
                x:
                    leftX,
                y:
                    end.y
            },
            end
        ],

        [
            start,
            {
                x:
                    rightX,
                y:
                    start.y
            },
            {
                x:
                    rightX,
                y:
                    end.y
            },
            end
        ]
    ];

    let best =
        null;

    let bestLength =
        Infinity;

    for(
        const candidate
        of candidates
    ){
        const path =
            removeDuplicatePoints(
                candidate
            );

        if(
            pathBlocked(
                path,
                obstacles
            )
        ){
            continue;
        }

        const length =
            pathLength(
                path
            );

        if(
            length <
            bestLength
        ){
            bestLength =
                length;

            best =
                path;
        }
    }

    if(best){
        return best;
    }

    return [
        start,
        end
    ];
}

function buildRelationshipOffsets(schema){
    const groups =
        new Map();

    for(
        const relationship
        of schema.relationships
    ){
        const pair =
            [
                relationship.fromTable,
                relationship.toTable
            ].sort();

        const key =
            pair[0] +
            "::" +
            pair[1];

        if(
            !groups.has(key)
        ){
            groups.set(
                key,
                []
            );
        }

        groups.get(key).push(
            relationship
        );
    }

    const offsets =
        new Map();

    for(
        const relationships
        of groups.values()
    ){
        const middle =
            (
                relationships.length -
                1
            ) /
            2;

        relationships.forEach(
            (
                relationship,
                index
            ) => {
                offsets.set(
                    relationship,
                    (
                        index -
                        middle
                    ) *
                    18
                );
            }
        );
    }

    return offsets;
}

function getClearestSide(
    table,
    tableElements
){
    const rect =
        table.getBoundingClientRect();

    const probes = {
        left: {
            x:
                rect.left -
                120,

            y:
                rect.top +
                rect.height /
                2
        },

        right: {
            x:
                rect.right +
                120,

            y:
                rect.top +
                rect.height /
                2
        },

        top: {
            x:
                rect.left +
                rect.width /
                2,

            y:
                rect.top -
                120
        },

        bottom: {
            x:
                rect.left +
                rect.width /
                2,

            y:
                rect.bottom +
                120
        }
    };

    let bestSide =
        "right";

    let bestDistance =
        -1;

    for(
        const [
            side,
            probe
        ]
        of Object.entries(
            probes
        )
    ){
        let nearest =
            Infinity;

        for(
            const other
            of tableElements.values()
        ){
            if(
                other ===
                table
            ){
                continue;
            }

            const otherRect =
                other.getBoundingClientRect();

            const distance =
                Math.hypot(
                    probe.x -
                    (
                        otherRect.left +
                        otherRect.width /
                        2
                    ),
                    probe.y -
                    (
                        otherRect.top +
                        otherRect.height /
                        2
                    )
                );

            nearest =
                Math.min(
                    nearest,
                    distance
                );
        }

        if(
            nearest >
            bestDistance
        ){
            bestDistance =
                nearest;

            bestSide =
                side;
        }
    }

    return bestSide;
}

function createSelfPath(
    table,
    tableElements,
    canvasRect,
    index
){
    const rect =
        getRect(
            table,
            canvasRect
        );

    const side =
        getClearestSide(
            table,
            tableElements
        );

    const distance =
        70 +
        index *
        35;

    if(
        side === "right"
    ){
        return [
            {
                x:
                    rect.right,
                y:
                    rect.centerY -
                    20
            },
            {
                x:
                    rect.right +
                    distance,
                y:
                    rect.centerY -
                    20
            },
            {
                x:
                    rect.right +
                    distance,
                y:
                    rect.centerY +
                    20
            },
            {
                x:
                    rect.right,
                y:
                    rect.centerY +
                    20
            }
        ];
    }

    if(
        side === "left"
    ){
        return [
            {
                x:
                    rect.left,
                y:
                    rect.centerY -
                    20
            },
            {
                x:
                    rect.left -
                    distance,
                y:
                    rect.centerY -
                    20
            },
            {
                x:
                    rect.left -
                    distance,
                y:
                    rect.centerY +
                    20
            },
            {
                x:
                    rect.left,
                y:
                    rect.centerY +
                    20
            }
        ];
    }

    if(
        side === "top"
    ){
        return [
            {
                x:
                    rect.centerX -
                    20,
                y:
                    rect.top
            },
            {
                x:
                    rect.centerX -
                    20,
                y:
                    rect.top -
                    distance
            },
            {
                x:
                    rect.centerX +
                    20,
                y:
                    rect.top -
                    distance
            },
            {
                x:
                    rect.centerX +
                    20,
                y:
                    rect.top
            }
        ];
    }

    return [
        {
            x:
                rect.centerX -
                20,
            y:
                rect.bottom
        },
        {
            x:
                rect.centerX -
                20,
            y:
                rect.bottom +
                distance
        },
        {
            x:
                rect.centerX +
                20,
            y:
                rect.bottom +
                distance
        },
        {
            x:
                rect.centerX +
                20,
            y:
                rect.bottom
        }
    ];
}

function buildPathData(points){
    if(
        points.length === 0
    ){
        return "";
    }

    let value =
        `M ${points[0].x} ${points[0].y}`;

    for(
        let i = 1;
        i < points.length;
        i++
    ){
        value +=
            ` L ${points[i].x} ${points[i].y}`;
    }

    return value;
}

function applyRelationshipMarkers(
    path,
    relationship
){
    path.setAttribute(
        "marker-start",
        relationship.type ===
            "one-to-one"
            ? "url(#schema-one)"
            : "url(#schema-many)"
    );

    path.setAttribute(
        "marker-end",
        "url(#schema-one)"
    );
}

function drawRelationships(
    document,
    canvas,
    svg,
    schema,
    tableElements,
    fast = false
){
    svg.replaceChildren();

    addRelationshipMarkers(
        document,
        svg
    );

    const canvasRect =
        canvas.getBoundingClientRect();

    const offsets =
        buildRelationshipOffsets(
            schema
        );

    const selfCounts =
        new Map();

    for(
        const relationship
        of schema.relationships
    ){
        const sourceTable =
            tableElements.get(
                relationship.fromTable
            );

        const targetTable =
            tableElements.get(
                relationship.toTable
            );

        if(
            !sourceTable ||
            !targetTable
        ){
            continue;
        }

        let points;

        if(
            sourceTable ===
            targetTable
        ){
            const index =
                selfCounts.get(
                    relationship.fromTable
                ) || 0;

            points =
                createSelfPath(
                    sourceTable,
                    tableElements,
                    canvasRect,
                    index
                );

            selfCounts.set(
                relationship.fromTable,
                index + 1
            );
        }
        else{
            const sourceRect =
                getRect(
                    sourceTable,
                    canvasRect
                );

            const targetRect =
                getRect(
                    targetTable,
                    canvasRect
                );

            const closest =
                getClosestPoints(
                    sourceRect,
                    targetRect
                );

            const offset =
                offsets.get(
                    relationship
                ) || 0;

            const start =
                shiftPoint(
                    closest.start,
                    offset
                );

            const end =
                shiftPoint(
                    closest.end,
                    offset
                );

            if(fast){
                points = [
                    start,
                    end
                ];
            }
            else{
                const obstacles =
                    getObstacleRects(
                        tableElements,
                        sourceTable,
                        targetTable,
                        canvasRect
                    );

                points =
                    choosePath(
                        start,
                        end,
                        obstacles
                    );
            }
        }

        const path =
            createSvgElement(
                document,
                "path"
            );

        path.setAttribute(
            "d",
            buildPathData(
                points
            )
        );

        path.setAttribute(
            "class",
            "schema-link"
        );

        path.setAttribute(
            "stroke-linejoin",
            "round"
        );

        applyRelationshipMarkers(
            path,
            relationship
        );

        svg.appendChild(
            path
        );
    }
}

function makeDraggable(
    popup,
    element,
    fastRedraw,
    fullRedraw
){
    const header =
        element.querySelector(
            ".schema-table-header"
        );

    let dragging =
        false;

    let offsetX =
        0;

    let offsetY =
        0;

    let frame =
        null;

    header.addEventListener(
        "mousedown",
        event => {
            dragging =
                true;

            const rect =
                element.getBoundingClientRect();

            offsetX =
                event.clientX -
                rect.left;

            offsetY =
                event.clientY -
                rect.top;

            event.preventDefault();
        }
    );

    popup.document.addEventListener(
        "mousemove",
        event => {
            if(!dragging){
                return;
            }

            element.style.left =
                `${Math.max(
                    0,
                    event.pageX -
                    offsetX
                )}px`;

            element.style.top =
                `${Math.max(
                    0,
                    event.pageY -
                    offsetY
                )}px`;

            if(
                frame !==
                null
            ){
                return;
            }

            frame =
                popup.requestAnimationFrame(
                    () => {
                        frame =
                            null;

                        fastRedraw();
                    }
                );
        }
    );

    popup.document.addEventListener(
        "mouseup",
        () => {
            if(!dragging){
                return;
            }

            dragging =
                false;

            if(
                frame !==
                null
            ){
                popup.cancelAnimationFrame(
                    frame
                );

                frame =
                    null;
            }

            fullRedraw();
        }
    );
}

function addStyles(document){
    const style =
        document.createElement(
            "style"
        );

    style.textContent = `
        html,
        body {
            margin: 0;
            min-width: 100%;
            min-height: 100%;
            background: #1e1e1e;
            color: #cccccc;
            font-family: Consolas, monospace;
        }

        body {
            overflow: auto;
        }

        #schema-canvas {
            position: relative;
            min-width: 100vw;
            min-height: 100vh;
        }

        #schema-links {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            overflow: visible;
            pointer-events: none;
            z-index: 1;
        }

        .schema-table {
            position: absolute;
            background: #252526;
            border: 1px solid #555555;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 5px 18px rgba(0, 0, 0, 0.35);
            z-index: 2;
        }

        .schema-table-header {
            padding: 12px 14px;
            background: #333333;
            color: #ffffff;
            font-weight: bold;
            font-size: 16px;
            cursor: move;
            user-select: none;
        }

        .schema-row {
            display: grid;
            grid-template-columns:
                65px
                minmax(90px, 1fr)
                minmax(100px, 1fr);
            min-height: 34px;
            border-top: 1px solid #3a3a3a;
        }

        .schema-row > div {
            display: flex;
            align-items: center;
            padding: 7px 9px;
            box-sizing: border-box;
            overflow-wrap: anywhere;
        }

        .schema-row > div + div {
            border-left: 1px solid #3a3a3a;
        }

        .schema-headings {
            background: #2d2d30;
            color: #9cdcfe;
            font-weight: bold;
        }

        .schema-key {
            color: #c586c0;
            font-weight: bold;
        }

        .schema-type {
            color: #4fc1ff;
        }

        .schema-link {
            fill: none;
            stroke: #dcdcaa;
            stroke-width: 2;
        }

        .schema-marker {
            fill: none;
            stroke: #dcdcaa;
            stroke-width: 1.8;
            stroke-linecap: round;
        }
    `;

    document.head.appendChild(
        style
    );
}

export async function getSchema(){
    const tableNames =
        await getTables();

    const schema = {
        __orinModuleType:
            "database.schema",

        tables:
            [],

        relationships:
            []
    };

    for(
        const tableName
        of tableNames
    ){
        const columns =
            await getColumns(
                tableName
            );

        const primaryKeys =
            await getPrimaryKeys(
                tableName
            );

        const uniqueConstraints =
            await getUniqueConstraints(
                tableName
            );

        const foreignKeys =
            await getForeignKeys(
                tableName
            );

        const foreignKeyColumns =
            new Set(
                foreignKeys.map(
                    foreignKey =>
                        foreignKey.column
                )
            );

        const uniqueColumns =
            new Set();

        for(
            const constraint
            of uniqueConstraints
        ){
            if(
                constraint.length === 1
            ){
                uniqueColumns.add(
                    constraint[0]
                );
            }
        }

        for(
            const column
            of columns
        ){
            column.primaryKey =
                primaryKeys.includes(
                    column.name
                );

            column.foreignKey =
                foreignKeyColumns.has(
                    column.name
                );

            column.unique =
                uniqueColumns.has(
                    column.name
                ) ||
                (
                    primaryKeys.length ===
                        1 &&
                    primaryKeys[0] ===
                        column.name
                );
        }

        schema.tables.push({
            name:
                tableName,

            columns:
                columns
        });

        const groups =
            new Map();

        for(
            const foreignKey
            of foreignKeys
        ){
            if(
                !groups.has(
                    foreignKey.constraint
                )
            ){
                groups.set(
                    foreignKey.constraint,
                    []
                );
            }

            groups.get(
                foreignKey.constraint
            ).push(
                foreignKey
            );
        }

        for(
            const group
            of groups.values()
        ){
            const localColumns =
                group.map(
                    foreignKey =>
                        foreignKey.column
                );

            const oneToOne =
                isUniqueForeignKey(
                    localColumns,
                    primaryKeys,
                    uniqueConstraints
                );

            for(
                const foreignKey
                of group
            ){
                schema.relationships.push({
                    fromTable:
                        tableName,

                    fromColumn:
                        foreignKey.column,

                    toTable:
                        foreignKey.referencedTable,

                    toColumn:
                        foreignKey.referencedColumn,

                    type:
                        oneToOne
                            ? "one-to-one"
                            : "many-to-one"
                });
            }
        }
    }

    return schema;
}

export function showSchema(
    schema,
    width = 1200,
    height = 800
){
    validateSchema(
        schema
    );

    if(
        !Number.isSafeInteger(
            width
        ) ||
        width < 500
    ){
        throw new Error(
            "width must be an integer of at least 500"
        );
    }

    if(
        !Number.isSafeInteger(
            height
        ) ||
        height < 400
    ){
        throw new Error(
            "height must be an integer of at least 400"
        );
    }

    const popup =
        window.open(
            "",
            "_blank",
            `width=${width},height=${height}`
        );

    if(!popup){
        throw new Error(
            "schema window was blocked by the browser"
        );
    }

    const document =
        popup.document;

    document.open();

    document.write(
        "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "<meta charset=\"UTF-8\">" +
        "<title>Orin Database Schema</title>" +
        "</head>" +
        "<body></body>" +
        "</html>"
    );

    document.close();

    addStyles(
        document
    );

    const canvas =
        document.createElement(
            "div"
        );

    canvas.id =
        "schema-canvas";

    const svg =
        createSvgElement(
            document,
            "svg"
        );

    svg.id =
        "schema-links";

    canvas.appendChild(
        svg
    );

    document.body.appendChild(
        canvas
    );

    const tableElements =
        new Map();

    for(
        const table
        of schema.tables
    ){
        const element =
            createTableElement(
                document,
                table
            );

        tableElements.set(
            table.name,
            element
        );

        canvas.appendChild(
            element
        );
    }

    runLayout(
        schema,
        tableElements,
        width
    );

    const fullRedraw =
        function(){
            resizeCanvas(
                popup,
                canvas,
                tableElements
            );

            drawRelationships(
                document,
                canvas,
                svg,
                schema,
                tableElements,
                false
            );
        };

    const fastRedraw =
        function(){
            resizeCanvas(
                popup,
                canvas,
                tableElements
            );

            drawRelationships(
                document,
                canvas,
                svg,
                schema,
                tableElements,
                true
            );
        };

    for(
        const element
        of tableElements.values()
    ){
        makeDraggable(
            popup,
            element,
            fastRedraw,
            fullRedraw
        );
    }

    fullRedraw();

    popup.addEventListener(
        "resize",
        fullRedraw
    );

    return true;
}

export function create(value){
    if(
        typeof value !== "object" ||
        value === null ||
        !Array.isArray(
            value.tables
        ) ||
        !Array.isArray(
            value.relationships
        )
    ){
        throw new Error(
            "value is not a valid database schema"
        );
    }

    value.__orinModuleType =
        "database.schema";

    return value;
}