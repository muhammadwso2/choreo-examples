import ballerina/http;
import ballerinax/mysql;
import ballerina/sql;
import ballerina/log;
import ballerinax/java.jdbc;
import ballerinax/mysql.driver as _;

configurable string dbHost = "localhost";
configurable string dbUsername = "admin";
configurable string dbPassword = "admin";
configurable string dbDatabase = "CHANNEL_DB";
configurable int dbPort = 3306;

table<Personalization> key(orgId) personalizationRecords = table [];

final mysql:Client|error dbClient;
boolean useDB = false;

function init() returns error? {

    if dbHost != "localhost" && dbHost != "" {
        useDB = true;
    }

    sql:ConnectionPool connPool = {
        maxOpenConnections: 20,
        minIdleConnections: 20,
        maxConnectionLifeTime: 300
    };

    mysql:Options mysqlOptions = {
        connectTimeout: 10
    };

    dbClient = new (dbHost, dbUsername, dbPassword, dbDatabase, dbPort, options = mysqlOptions, connectionPool = connPool);

    if dbClient is sql:Error {
        if (!useDB) {
            log:printInfo("DB configurations are not given. Hence storing the data locally");
        } else {
            log:printError("DB configuraitons are not correct. Please check the configuration", 'error = <sql:Error>dbClient);
            return error("DB configuraitons are not correct. Please check the configuration");
        }
    }

    if useDB {
        log:printInfo("DB configurations are given. Hence storing the data in DB");
    }

}

function getConnection() returns jdbc:Client|error {
    return dbClient;
}

function getPersonalization(string orgId) returns Personalization|error|http:NotFound {

    if (useDB) {
        return dbGetPersonalization(orgId);
    } else {
        Personalization? personalization = personalizationRecords[orgId];
        if personalization is () {
            return http:NOT_FOUND;
        }
        return personalization;
    }
}

function updatePersonalization(string orgId, Personalization personalization) returns Personalization|error {

    if (useDB) {
        return dbUpdatePersonalization(personalization);
    } else {
        Personalization? oldPersonalizationRecord = personalizationRecords[orgId];
        if oldPersonalizationRecord !is () {
            _ = personalizationRecords.remove(orgId);
        }
        personalizationRecords.put({
            ...personalization
        });
        return personalization;
    }
}

function deletePersonalization(string orgId) returns string|()|error {

    if (useDB) {
        return dbDeletePersonalization(orgId);
    } else {
        Personalization? oldPersonalizationRecord = personalizationRecords[orgId];
    if oldPersonalizationRecord !is () {
        _ = personalizationRecords.remove(orgId);
    }

    return "Branding deleted successfully";
    }
}
