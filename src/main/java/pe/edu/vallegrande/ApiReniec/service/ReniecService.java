package pe.edu.vallegrande.ApiReniec.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import lombok.extern.slf4j.Slf4j;
import pe.edu.vallegrande.ApiReniec.model.DataReniec;
import pe.edu.vallegrande.ApiReniec.repository.ReniecRepository;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class ReniecService {

	private static final String RENIEC_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNyaXN0aG9wZXJzb2NhbGF5cmFtaXJlekBnbWFpbC5jb20ifQ.147XdN_92pJCPRaPZ5PzUBvlX4mkrjIl-FqR57g71KE";
	private static final String RENIEC_ENDPOINT = "https://dniruc.apisperu.com/api/v1/dni/";

	private final WebClient webClient;
	private final ReniecRepository reniecRepository;

	public ReniecService(WebClient.Builder webClientBuilder, ReniecRepository reniecRepository) {
		this.webClient = webClientBuilder.baseUrl(RENIEC_ENDPOINT).build();
		this.reniecRepository = reniecRepository;
	}

	public Mono<DataReniec> fetchAndSaveReniecData(String dni) {
		String url = RENIEC_ENDPOINT + dni + "?token=" + RENIEC_TOKEN;

		return webClient.get()
				.uri(url)
				.retrieve()
				.bodyToMono(DataReniec.class)
				.doOnNext(reniec -> {

					log.info("Datos obtenidos de RENIEC: {}", reniec);
					reniec.setDni(dni);
				})
				.flatMap(reniecRepository::save)
				.doOnError(error -> {
					if (error instanceof WebClientResponseException) {
						WebClientResponseException ex = (WebClientResponseException) error;
						log.error("Error al consumir API RENIEC: {} - {}", ex.getStatusCode(),
								ex.getResponseBodyAsString());
					} else {
						log.error("Error desconocido: ", error);
					}
				});
	}

	@Transactional
	public Mono<DataReniec> updateReniecData(Long id, String newDni) {
		return reniecRepository.findById(id)
				.switchIfEmpty(Mono.error(new RuntimeException("Registro no encontrado con ID: " + id)))
				.flatMap(existingData -> {
					String url = RENIEC_ENDPOINT + newDni + "?token=" + RENIEC_TOKEN;

					return webClient.get()
							.uri(url)
							.retrieve()
							.bodyToMono(DataReniec.class)
							.doOnNext(reniec -> log.info("Datos obtenidos de RENIEC: {}", reniec))
							.flatMap(fetchedData -> {
								existingData.setDni(newDni);
								existingData.setNombres(fetchedData.getNombres());
								existingData.setApellidoPaterno(fetchedData.getApellidoPaterno());
								existingData.setApellidoMaterno(fetchedData.getApellidoMaterno());
								existingData.setCodVerifica(fetchedData.getCodVerifica());

								return reniecRepository.save(existingData);
							});
				})
				.doOnError(error -> log.error("Error al actualizar registro: ", error));
	}

	public Mono<Void> deleteLogically(Long id) {
		return reniecRepository.inactiveReniec(id)
				.doOnSuccess(unused -> log.info("Registro con ID {} marcado como inactivo.", id))
				.doOnError(error -> log.error("Error al intentar eliminar lógicamente el registro con ID {}: {}", id,
						error.getMessage()));
	}

	public Mono<Void> restoreLogically(Long id) {
		return reniecRepository.activeReniec(id)
				.doOnSuccess(unused -> log.info("Registro con ID {} marcado como activo.", id))
				.doOnError(error -> log.error("Error al intentar restaurar lógicamente el registro con ID {}: {}", id,
						error.getMessage()));
	}
}
